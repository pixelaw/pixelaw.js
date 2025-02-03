
import type { App, Coordinate, Interaction, Pixel, PixelStore } from "./types.ts"
import type { CoreStatus, Engine, EngineConstructor, PixelCoreEvents, WorldConfig } from "./types.ts"

import mitt from "mitt"
import { Canvas2DRenderer } from "./renderers"
import type { AppStore, TileStore } from "./types.ts"


export class PixelawCore {
    status: CoreStatus = "uninitialized"
    worldConfig: WorldConfig = null!
    engine: Engine = null!
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    appStore: AppStore = null!
    viewPort: Canvas2DRenderer = null!
    events = mitt<PixelCoreEvents>()
    private app: App | null = null
    private color = 0
    private engines: Set<EngineConstructor<Engine>> = new Set()

    // TODO add Query(string) manager that allows safe read/write to the zoom/world etc.
    // TODO Wallets?

    registerEngines(engines: EngineConstructor<Engine>[]) {
        for (const engine of engines) {
            this.engines.add(engine);
        }
    }

    async loadWorld(worldConfig: WorldConfig) {
        if (this.worldConfig && JSON.stringify(this.worldConfig) === JSON.stringify(worldConfig)) {
            console.log("Configuration already loaded.")
            return
        }

        this.updateStatus("loadConfig")
        this.worldConfig = worldConfig

        const engineClass = Array.from(this.engines).find(engine => {
            return engine.name.toLowerCase() === worldConfig.engine
        })

            if (!engineClass) {
            throw new Error(`Unsupported engine: ${worldConfig.engine}`)
            }

            this.engine = new engineClass()

        this.updateStatus("initializing")

        await this.engine.init(worldConfig.config)

        this.pixelStore = this.engine.pixelStore
        this.tileStore = this.engine.tileStore
        this.appStore = this.engine.appStore

        this.viewPort = new Canvas2DRenderer(this.events, this.tileStore, this.pixelStore)

        this.updateStatus("ready")
    }

    public getApp(): App | null {
        return this.app
    }

    public setApp(newApp: App | null) {
        this.updateApp(newApp)
    }

    public getColor(): number | null {
        return this.color
    }

    public setColor(newColor: number | null) {
        this.updateColor(newColor)
    }

    public handleInteraction(coordinate: Coordinate): Interaction {
        const pixel = this.pixelStore.getPixel(coordinate)
        // FIXME Handle empty pixel

        return this.engine.handleInteraction(this.app, pixel, this.color)
    }

    private updateStatus(newStatus: CoreStatus) {
        this.status = newStatus
        this.events.emit("statusChange", newStatus)
    }

    private updateApp(newApp: App) {
        this.app = newApp
        this.events.emit("appChange", newApp)
    }

    private updateColor(newColor: number) {
        this.color = newColor
        this.events.emit("colorChange", newColor)
    }
}
