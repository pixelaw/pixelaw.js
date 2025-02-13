import type {
    App,
    AppStore,
    Engine,
    EngineStatus,
    Interaction,
    Pixel,
    PixelStore,
    TileStore,
    UpdateService,
} from "@pixelaw/core"
import type {PixelawCore} from "@pixelaw/core/src";

export type MudConfig = {
    todo: number
}

export class MudEngine implements Engine {
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    appStore: AppStore = null!
    updateService: UpdateService = null!
    status: EngineStatus = "uninitialized"
    config: MudConfig = null!
    core: PixelawCore

    constructor(core: PixelawCore) {
        this.core = core
    }
    async init(config: MudConfig) {
        console.log("MudEngine init", config, this.constructor.name)
    }
    async setAccount(wallet: unknown) {}
    // biome-ignore lint/correctness/noUnusedVariables: TODO
    handleInteraction(app: App, pixel: Pixel): Interaction {
        return {
            dialog: null,
            action: () => {},
        }
        // TODO app has plugin
        // TODO determine function
        // TODO determine arguments
        // TODO build dialog
        // TODO populate actions
        // pixel
        // app
        // engine.manifest
        // engine.account?
    }
}
