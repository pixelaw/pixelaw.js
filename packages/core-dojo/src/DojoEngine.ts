import {
    NAMESPACE,
    type PixelawCore,
    RestTileStore,
    type Wallet,
    type WalletJson,
    WsUpdateService,
    createDialog
} from "@pixelaw/core"
import type { App, Engine, EngineStatus, Pixel, PixelStore, Position } from "@pixelaw/core"
import { DojoAppStore } from "./DojoAppStore.ts"
import { type DojoStuff, dojoInit } from "./DojoEngine.init.ts"
import { DojoInteraction } from "./DojoInteraction.ts"
import DojoSqlPixelStore from "./DojoSqlPixelStore.ts"
import type {DojoWallet} from "./DojoWallet.ts";
import { schema } from "./generated/models.gen.ts"
import {type DojoConfig, ENGINE_ID} from "./types.ts"
import getParamsDef, { generateDojoCall } from "./utils/paramsDef.ts"

export class DojoEngine implements Engine {
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
            this.dojoSetup = await dojoInit(this.config, schema)
            this.status = this.dojoSetup ? "ready" : "error"

            // Setup AppStore
            this.core.appStore = new DojoAppStore(this.dojoSetup)

            // Setup PixelStore
            this.core.pixelStore = new DojoSqlPixelStore(this.config.toriiUrl, this.dojoSetup!.sdk!)


            // Setup UpdateService
            this.core.updateService = new WsUpdateService(config.serverUrl)


            // Setup TileStore
            this.core.tileStore = new RestTileStore(config.serverUrl)

        } catch (error) {
            console.error("Dojo init error:", error)
        }
    }

    // async loadWallet(walletJson: WalletJson): Promise<Wallet> {
    //     if(walletJson.engine !== ENGINE_ID) throw Error("Incorrect engine for walletJson")
    //
    //     // TODO uh oh, this is probably in ReactDojo?
    // }

    handleInteraction(app: App, pixel: Pixel | undefined, color: number): DojoInteraction {
        const result = new DojoInteraction()

        // TODO maybe we want to do more if no app?
        if (!app) return result

        if (!app.plugin) {
            // Autogenerated Interaction dialog and/or actions
            const pixelAction = pixel?.action ? pixel.action : "interact"

            const contractName = `${app.name}_actions`
            const position: Position = { x: pixel.x, y: pixel.y }

            const params = getParamsDef(this.dojoSetup.manifest, contractName, pixelAction, false)

            const action = (params) => {
                console.log("params", params)

                const dojoCall = generateDojoCall(
                    this.dojoSetup.manifest,
                    params,
                    contractName,
                    pixelAction,
                    position,
                    color,
                )
                const wallet = this.core.getWallet() as DojoWallet
                const account = wallet.getAccount()
                console.log("acc", account)
                console.log("dojoCall", dojoCall)
                this.dojoSetup.provider
                    .execute(account!, dojoCall, NAMESPACE, {})
                    .then((res) => {
                        console.log("dojocall after exec", res)
                        // TODO animate "flickering" of the pixel that was modified?
                        // pixelStore.setPixelColor(clickedCell, hexRGBtoNumber(color))
                        // pixelStore.setCacheUpdated(Date.now())
                    })
                    .catch((error) => {
                        console.error("Error executing DojoCall:", error)
                        // Handle the error appropriately here
                    })
            }

            if (params.length) {
                result.dialog = createDialog(action, params)
                result.action = action
            } else {
                // No dialog, so we execute the interaction immediately
                action(params)
            }
        } else {
            // TODO Load interaction from somewhere else (experimental)
        }

        return result
    }

    // setAccount(account: unknown | null) {
    //     console.log({ account })
    //     this.account = account as Account
    // }
}
