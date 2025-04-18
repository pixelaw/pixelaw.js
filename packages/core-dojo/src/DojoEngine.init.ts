import type ControllerConnector from "@cartridge/connector/controller"
import type { Manifest } from "@dojoengine/core"
import { DojoProvider } from "@dojoengine/core"
import { BurnerConnector, BurnerManager, type BurnerManagerOptions } from "@dojoengine/create-burner"
import { init, KeysClause, type SDK, ToriiQueryBuilder, type ToriiResponse } from "@dojoengine/sdk"
import type { App, PixelawCore } from "@pixelaw/core"
import { Account, RpcProvider } from "starknet"
import type { Storage, StorageValue } from "unstorage"
import type { SchemaType } from "./generated/models.gen.ts"
import type { DojoConfig } from "./types.ts"
import { getControllerConnector } from "./utils/controller.ts"
import { felt252ToString, felt252ToUnicode, formatAddress, getAbi } from "./utils/utils.starknet.ts"

import { baseManifest } from "./utils/manifest.js"

export type DojoStuff = {
    apps: App[]
    manifest: Manifest | null
    coreAddress: string
    controllerConnector: ControllerConnector | null
    burnerConnector: BurnerConnector | null
    sdk: SDK<SchemaType> | null
    provider: DojoProvider
    toriiUrl: string
}
const controllerConnectorCache = new Map<string, ControllerConnector | null>()
const burnerConnectorCache = new Map<string, Promise<BurnerConnector | null>>()

export async function dojoInit(worldConfig: DojoConfig, core: PixelawCore): Promise<DojoStuff> {
    if (!worldConfig) {
        throw new Error("WorldConfig is not loaded")
    }
    const toriiUrl = worldConfig.toriiUrl
    const sdkSetup = {
        client: {
            rpcUrl: worldConfig.rpcUrl,
            toriiUrl: worldConfig.toriiUrl,
            relayUrl: worldConfig.relayUrl,
            worldAddress: worldConfig.world,
        },
        domain: {
            name: "pixelaw",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    }
    const sdk = await init<SchemaType>(sdkSetup)

    const { apps, manifest, coreAddress } = await fetchAppsAndManifest(worldConfig, sdk)

    const provider = new DojoProvider(manifest, worldConfig.rpcUrl)

    const controllerConnector = setupControllerConnector(manifest, worldConfig)

    const burnerConnector = await setupBurnerConnector(provider, worldConfig, core.storage)

    return {
        sdk,
        controllerConnector,
        apps,
        manifest,
        coreAddress,
        burnerConnector,
        provider,
        toriiUrl,
    }
}

async function fetchAppsAndManifest(
    worldConfig: DojoConfig,
    sdk: SDK<SchemaType>,
): Promise<{ apps: App[]; manifest: Manifest; coreAddress: string }> {
    try {
        // const [initialEntities, subscription] = await sdk.subscribeEntityQuery({
        //     historical: false,
        //     query: new ToriiQueryBuilder()
        //         .withClause(KeysClause([], [undefined], "VariableLen").build())
        //         .addEntityModel("pixelaw-App")
        //         .includeHashedKeys(),
        //     callback(response: { data?: ToriiResponse<SchemaType, false>; error?: Error }): void {
        //         if (response.data[0].entityId === "0x0") return
        //         console.log("jaja", response.data[0])
        //     },
        // })

        const query = "SELECT internal_entity_id, name, system, action, icon FROM 'pixelaw-App';"

        const response = await fetch(`${worldConfig.toriiUrl}/sql?query=${query}`)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const json = await response.json()
        const apps = json.map((item) => {
            return {
                name: felt252ToString(item.name),
                icon: felt252ToUnicode(item.icon),
                action: felt252ToString(item.action),
                system: item.system,
                entity: {
                    id: item.internal_entity_id,
                },
            }
        })

        const contracts = await Promise.all(
            apps.map((app) => getAbi(new RpcProvider({ nodeUrl: worldConfig.rpcUrl }), app)),
        )

        // TODO Retrieve core actions manifest too, so we'll have the address for process_queue

        // TODO make this dynamic based on chain
        const base = baseManifest(worldConfig.world)

        const coreContract = base.contracts[0]

        const manifest = {
            ...base,
            contracts,
        } as unknown as Manifest

        // console.log(coreContract)

        return { apps, manifest, coreAddress: coreContract.address }
    } catch (error) {
        console.error("Error fetching apps and manifest:", error)
        return { apps: [], manifest: {} as Manifest, coreAddress: "" }
    }
}

function setupControllerConnector(manifest: Manifest, worldConfig: DojoConfig): ControllerConnector | null {
    // return null // TODO disabling controller since it broke with latest dojo update
    if (!worldConfig.wallets.controller) {
        return null
    }
    const cacheKey = JSON.stringify({ manifest, rpcUrl: worldConfig.wallets.controller?.rpcUrl })
    if (controllerConnectorCache.has(cacheKey)) {
        return controllerConnectorCache.get(cacheKey) || null
    }

    const connector = worldConfig.wallets.controller
        ? getControllerConnector({
              feeTokenAddress: worldConfig.feeTokenAddress,
              manifest,
              rpcUrl: worldConfig.wallets.controller.rpcUrl!,
          })
        : null

    controllerConnectorCache.set(cacheKey, connector)
    return connector
}

async function setupBurnerConnector(
    rpcProvider: DojoProvider,
    worldConfig: DojoConfig,
    storage: Storage<StorageValue>,
): Promise<BurnerConnector | null> {
    const cacheKey = JSON.stringify({ rpcProvider, burnerConfig: worldConfig.wallets?.burner })
    if (burnerConnectorCache.has(cacheKey)) {
        return burnerConnectorCache.get(cacheKey) || null
    }

    // Load them in advance, needs to be async
    const burnerCookies = await storage.getItem("burner")

    // TODO this document shim of cookie is for storage of burners using the Cookie library
    if (typeof window === "undefined") {
        // @ts-ignore don't care about implementing the other fields, its for nodejs
        global.document = {
            get cookie() {
                return (burnerCookies as string) ?? ""
            },
            set cookie(cookieStr) {
                storage.setItem("burner", cookieStr).catch(console.error)
            },
        }
    }

    const promise = (async () => {
        if (worldConfig.wallets?.burner) {
            const burnerConfig = worldConfig.wallets.burner

            const manager = new BurnerManager({
                ...burnerConfig,
                feeTokenAddress: worldConfig.feeTokenAddress,
                rpcProvider: rpcProvider.provider,
                masterAccount: new Account(
                    rpcProvider.provider,
                    burnerConfig.masterAddress!,
                    burnerConfig.masterPrivateKey!,
                ),
            } as unknown as BurnerManagerOptions)

            await manager.init()

            if (manager.list().length === 0) {
                try {
                    await manager.create()
                } catch (e) {
                    console.error(e)
                }
            }
            console.log("burn")
            return new BurnerConnector(
                {
                    id: "burner",
                    name: `burner_${formatAddress(manager.account!.address)}`,
                },
                manager.account!,
            )
        }
        return null
    })()

    burnerConnectorCache.set(cacheKey, promise)
    return promise
}
