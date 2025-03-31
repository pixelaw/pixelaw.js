import {
    type App,
    type Coordinate,
    type Engine,
    type Engines,
    type EngineStatus,
    type Interaction,
    type InteractParams,
    NAMESPACE,
    type Pixel,
    type PixelawCore,
    type QueueItem,
    WsUpdateService,
} from "@pixelaw/core"
import { Account } from "starknet"
import { DojoAppStore } from "./DojoAppStore.ts"
import { dojoInit, type DojoStuff } from "./DojoEngine.init.ts"
import { DojoInteraction } from "./DojoInteraction.ts"
import { DojoQueueStore } from "./DojoQueueStore.ts"
import DojoSqlPixelStore from "./DojoSqlPixelStore.ts"
import { DojoWallet } from "./DojoWallet.ts"
import { type DojoConfig, ENGINE_ID } from "./types.ts"
import {
    convertSnakeToPascal,
    extractParameters,
    findContract,
    findFunctionDefinition,
    prepareParams,
    // prepareParams2,
} from "./interaction/params.ts"

export class DojoEngine implements Engine {
    id: Engines = ENGINE_ID
    status: EngineStatus = "uninitialized"
    config: DojoConfig = null!
    dojoSetup: DojoStuff | null = null
    core: PixelawCore

    constructor(core: PixelawCore) {
        this.core = core
    }

    async init(config: DojoConfig) {
        this.config = config
        try {
            // Setup Dojo
            this.dojoSetup = await dojoInit(this.config, this.core)
            this.status = this.dojoSetup ? "ready" : "error"

            // Setup AppStore
            this.core.appStore = await DojoAppStore.getInstance(this.dojoSetup)

            // Setup PixelStore
            this.core.pixelStore = await DojoSqlPixelStore.getInstance(this.core)

            // Setup UpdateService
            this.core.updateService = new WsUpdateService(config.serverUrl)

            // Setup TileStore
            // this.core.tileStore = new RestTileStore(config.serverUrl)

            this.core.queue = await DojoQueueStore.getInstance(this.config.toriiUrl, this.dojoSetup)
        } catch (error) {
            console.error("Dojo init error:", error)
        }
    }

    async handleInteraction(app: App, pixel: Pixel | undefined, color: number): Promise<Interaction> {
        if (app.plugin) {
            // TODO Load interaction from somewhere else (experimental)
            return
        }
        const interaction: Interaction = await DojoInteraction.create(this, app, pixel, color)

        return interaction
    }

    async prepInteraction(coordinate: Coordinate): Promise<Interaction> {
        const pixel = this.core.pixelStore.getPixel(coordinate) ?? ({ x: coordinate[0], y: coordinate[1] } as Pixel)
        const app = this.core.appStore.getByName(this.core.getApp())
        const color = this.core.getColor()

        const interaction: Interaction = await DojoInteraction.create(this, app, pixel, color)

        return interaction
    }

    // async executeInteraction(interaction: Interaction): Promise<void> {
    //     console.log("TODO executeInteraction")
    //     for (const p of interactParams) {
    //         // Call the transformer if it's there. This will ensure params are ready for submission to chain.
    //         if (p.transformer) await p.transformer()
    //     }
    //     this.action(params)
    // }

    // async prepInteraction2(pixel: Pixel | null): Promise<InteractParams> {
    //     const functionName = pixel?.action ? pixel.action : "interact"
    //     const contractName = `${this.core.getApp()}_actions`
    //     const position = { x: pixel.x, y: pixel.y }
    //     const manifest = this.dojoSetup.manifest
    //
    //     const contract = findContract(manifest, contractName)
    //     if (!contract) return
    //
    //     const functionDef = findFunctionDefinition(contract.abi, `I${convertSnakeToPascal(contractName)}`, functionName)
    //     if (!functionDef) return
    //
    //     const rawParams = extractParameters(functionDef)
    //
    //     const params = await prepareParams(this, position, rawParams, contract.abi)
    //
    //     return params
    // }

    async executeQueueItem(item: QueueItem): Promise<boolean> {
        const dojoCall = {
            contractAddress: "0x074d62337ea2319f3e65d75cda97bc8691a3e0e6c5efc12ceb3e982c3caf62f8", //this.dojoSetup.coreAddress,
            entrypoint: "process_queue",
            calldata: [
                item.id,
                item.timestamp,
                item.called_system,
                item.selector,
                item.calldata.length,
                ...item.calldata,
            ],
        }

        const wallet = this.core.getWallet() as DojoWallet
        if (!wallet || !wallet.account) {
            console.log("executeQueueItem but no wallet")
            return
        }
        const account = wallet.getAccount()

        this.dojoSetup.provider
            .execute(account!, dojoCall, NAMESPACE, {})
            .then((res) => {
                console.log("dojocall after exec", res)
            })
            .catch((error) => {
                console.error("Error executing DojoCall:", error)
                // TODO Handle the error appropriately here
            })

        return true
    }

    /*
    | Account address |  0x13d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7
| Private key     |  0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b
| Public key      |  0x4c339f18b9d1b95b64a6d378abd1480b2e0d5d5bd33cd0828cbce4d65c27284

     */
    async getPreDeployedWallet(privateKey: string): Promise<DojoWallet> {
        // privateKey = "0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b"
        // const deployer = "0x41a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf"
        //
        // const publicKey = ec.starkCurve.getStarkKey(privateKey)
        //
        // TODO for now just hardcoding the 2nd predeployed from dev katana
        const address = "0x13d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7"
        const account = new Account(this.dojoSetup.provider.provider, address, privateKey, "1", "0x3")
        const chainId = await this.dojoSetup.provider.provider.getChainId()
        return new DojoWallet("predeployed", chainId, account)
    }
}
