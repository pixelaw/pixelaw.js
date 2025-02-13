import type {
    Coordinate,
    CoreDefaults,
    Interaction,
    Pixel,
    PixelStore,
    UpdateService,
    Wallet,
    WorldsRegistry
} from "./types.ts"
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
    updateService: UpdateService = null!
    viewPort: Canvas2DRenderer = null!
    events = mitt<PixelCoreEvents>()

    private worldsRegistry: WorldsRegistry
    private app: string | null = null
    private color = 0
    private zoom = 1
    private center: Coordinate = [0, 0]
    private world: string
    private engines: Set<EngineConstructor<Engine>> = new Set()
    private wallet: Wallet | null =  null

    constructor(engines: EngineConstructor<Engine>[], worldsRegistry: WorldsRegistry) {
        for (const engine of engines) {
            this.engines.add(engine)
        }

        this.worldsRegistry = worldsRegistry
    }

    // TODO Wallets/persistence?
    /*
    Wallet can be identified as string: "walletname-network-account"
    Engine has a list of supported wallets, and worldConfig can have custom wallet config/def (mainly for burner)

    Core can only contain definition/code for wallets that don't need browser/react
    But a reference to a StarknetProvider is okay
    Or we can abstract the Provider so the Core only knows of a Wallet it can call execute on?

     */

    public getWallet():  Wallet | null{
        return this.wallet
    }

    public setWallet(wallet: Wallet | null){
        this.wallet = wallet
        this.events.emit("walletChanged", wallet)
    }

    public getEngine(): string | null {
        return this.engine ? this.engine.constructor.name : null
    }

    public async loadWorld(world: string, coreDefaults?: CoreDefaults) {

        if(!Object.prototype.hasOwnProperty.call(this.worldsRegistry, world)) throw Error(`World ${world} does not exist in registry`)

        this.setStatus("loadConfig")
        const worldConfig = this.worldsRegistry[world]

        const engineClass = Array.from(this.engines).find((engine) => {
            return engine.name.toLowerCase() === worldConfig.engine
        })

        if (!engineClass) {
            throw new Error(`Unsupported engine: ${worldConfig.engine}`)
        }

        this.engine = new engineClass(this)

        this.setStatus("initializing")

        await this.engine.init(worldConfig.config)


        this.viewPort = new Canvas2DRenderer(this.events, this.tileStore, this.pixelStore)

        // Setting defaults if provided
        const defaults = coreDefaults ?? worldConfig.defaults;
        if (defaults) {
            this.setApp(defaults.app);
            this.setColor(defaults.color);
            this.setCenter(defaults.center as Coordinate);
            this.setZoom(defaults.zoom);
        }


        this.setWorld(world)

        this.worldConfig = worldConfig

        this.setStatus("ready")
        this.events.emit("engineChanged", this.engine)
    }

    private setStatus(newStatus: CoreStatus) {
        this.status = newStatus
        this.events.emit("statusChanged", newStatus)
    }

    public getWorldsRegistry(): WorldsRegistry  {
        return this.worldsRegistry
    }

    public getApp(): string | null {
        return this.app
    }

    public setApp(newApp: string | null) {
        this.app = newApp
        this.events.emit("appChanged", newApp)
    }

    private setWorld(newWorld: string | null) {
        this.world = newWorld
        this.events.emit("worldChanged", newWorld)
    }

    public getColor(): number | null {
        return this.color
    }

    public setColor(newColor: number | null) {
        this.color = newColor
        this.events.emit("colorChanged", newColor)
    }

    public getZoom(): number {
        return this.zoom
    }

    public setZoom(newZoom: number) {
        this.zoom = newZoom
        this.events.emit("zoomChanged", newZoom)
    }

    public getCenter(): Coordinate {
        return this.center
    }

    public setCenter(newCenter: Coordinate) {
        this.center = newCenter
        this.events.emit("centerChanged", newCenter)
    }

    public getWorld(): string | undefined {
        return this.world
    }

    public handleInteraction(coordinate: Coordinate): Interaction {
        const pixel = this.pixelStore.getPixel(coordinate) ?? ({ x: coordinate[0], y: coordinate[1] } as Pixel)
        const app = this.appStore.getByName(this.app)
        return this.engine.handleInteraction(app, pixel, this.color)
    }

}
