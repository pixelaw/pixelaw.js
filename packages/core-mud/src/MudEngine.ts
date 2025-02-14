import type {
    App,
    Engine,
    EngineStatus,
    Interaction,
    Pixel,PixelawCore
} from "@pixelaw/core"

export type MudConfig = {
    todo: number
}

export class MudEngine implements Engine {
    status: EngineStatus = "uninitialized"
    config: MudConfig = null!
    core: PixelawCore

    constructor(core: PixelawCore) {
        this.core = core
    }
    async init(config: MudConfig) {
        console.log("MudEngine init", config, this.constructor.name)
    }

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
