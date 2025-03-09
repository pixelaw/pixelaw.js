import type {App, Engine, EngineStatus, Interaction, Pixel} from "@pixelaw/core"
import {type Engines, type PixelawCore, WsUpdateService} from "@pixelaw/core"
import {DojoAppStore} from "./DojoAppStore.ts"
import {dojoInit, type DojoStuff} from "./DojoEngine.init.ts"
import {DojoInteraction} from "./DojoInteraction.ts"
import {DojoQueueStore} from "./DojoQueueStore.ts"
import DojoSqlPixelStore from "./DojoSqlPixelStore.ts"
import {type DojoConfig, ENGINE_ID} from "./types.ts"

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
            this.core.appStore = new DojoAppStore(this.dojoSetup)

            // Setup PixelStore TODO why the getInstance
            this.core.pixelStore = await DojoSqlPixelStore.getInstance(this.config.toriiUrl, this.dojoSetup!.sdk!)
            // this.core.pixelStore = new DojoSqlPixelStore(this.config.toriiUrl, this.dojoSetup!.sdk!)

            // Setup UpdateService
            this.core.updateService = new WsUpdateService(config.serverUrl)

            // Setup TileStore
            // this.core.tileStore = new RestTileStore(config.serverUrl)

            this.core.queue = await DojoQueueStore.getInstance(this.dojoSetup)
        } catch (error) {
            console.error("Dojo init error:", error)
        }
    }

    async handleInteraction(app: App, pixel: Pixel | undefined, color: number): Promise<Interaction> {
        if (app.plugin) {
            // TODO Load interaction from somewhere else (experimental)
            return
        }
        const interaction: Interaction = await DojoInteraction.new(this, app, pixel, color)

        return interaction
    }
}
