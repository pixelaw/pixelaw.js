import type { App, Engine, EngineStatus, Engines, Interaction, Pixel, PixelawCore, QueueItem } from "@pixelaw/core"

export type MudConfig = {
    todo: number
}

const ENGINE_ID = "mud"

export class MudEngine implements Engine {
    id: Engines = ENGINE_ID
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
    async handleInteraction(app: App, pixel: Pixel): Promise<Interaction> {
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

    executeQueueItem(queueItem: QueueItem): Promise<boolean> {
        return Promise.resolve(false)
    }
}
