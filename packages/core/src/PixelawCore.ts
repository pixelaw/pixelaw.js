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
import { type Storage, createStorage, prefixStorage } from "unstorage";
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
    private storage: Storage

    constructor(engines: EngineConstructor<Engine>[], worldsRegistry: WorldsRegistry, storage: Storage = undefined) {
        for (const engine of engines) {
            this.engines.add(engine)
        }

        this.worldsRegistry = worldsRegistry

        // Use a default storage if none is provided, this means Core will never remember wallets, world and such
        this.storage = storage ?? createStorage()
    }

    public getWallet():  Wallet | null{
        return this.wallet
    }

    public setWallet(wallet: Wallet | null){
        this.wallet = wallet
        this.events.emit("walletChanged", wallet)

        this.storage.setItem(this.getStorageKey("wallet"),wallet)

    }


    public getEngine(): string | null {
        return this.engine ? this.engine.constructor.name : null
    }

    private async getStorageDefaults(): Promise<CoreDefaults | undefined> {
        // Use Promise.all to fetch all items concurrently, improving time efficiency
        const [app, color, center, zoom] = await Promise.all([
            this.storage.getItem(this.getStorageKey("app")),
            this.storage.getItem(this.getStorageKey("color")),
            this.storage.getItem(this.getStorageKey("center")),
            this.storage.getItem(this.getStorageKey("zoom"))
        ]);

        // Check for undefined values directly, improving readability
        if (app !== null && color !== null && center !== null && zoom !== null) {
            return { app: app as string, color: color as number, center: center as number[], zoom: zoom as number };
        }
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


        this.setWorld(world)

        const storageDefaults = await this.getStorageDefaults()

        const defaults = storageDefaults ?? coreDefaults ?? worldConfig.defaults;
        if (defaults) {
            this.setApp(defaults.app);
            this.setColor(defaults.color);
            this.setCenter(defaults.center as Coordinate);
            this.setZoom(defaults.zoom);
        }

        this.viewPort = new Canvas2DRenderer(this.events, this.tileStore, this.pixelStore, this.zoom, this.center)

        this.worldConfig = worldConfig

        this.events.on("centerChanged", (newCenter: Coordinate) => {
            this.setCenter(newCenter);
        });

        this.events.on("zoomChanged", (newZoom: number) => {
            this.setZoom(newZoom);
        });

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
        this.storage.setItem(this.getStorageKey("app"),newApp)
    }

    private setWorld(newWorld: string ) {
        this.world = newWorld
        this.events.emit("worldChanged", newWorld)
    }

    public getColor(): number  {
        return this.color
    }

    public setColor(newColor: number | null) {
        this.color = newColor
        this.events.emit("colorChanged", newColor)
        this.storage.setItem(this.getStorageKey("color"),newColor)
    }

    public getZoom(): number {
        return this.zoom
    }

    public setZoom(newZoom: number) {
        this.zoom = newZoom
        // this.events.emit("zoomChanged", newZoom)
        this.storage.setItem(this.getStorageKey("zoom"),newZoom)
    }

    public getCenter(): Coordinate {
        return this.center
    }

    public setCenter(newCenter: Coordinate) {
        this.center = newCenter
        // this.events.emit("centerChanged", newCenter)
        this.storage.setItem(this.getStorageKey("center"),newCenter)
    }

    public getWorld(): string {
        return this.world
    }

    public handleInteraction(coordinate: Coordinate): Interaction {
        const pixel = this.pixelStore.getPixel(coordinate) ?? ({ x: coordinate[0], y: coordinate[1] } as Pixel)
        const app = this.appStore.getByName(this.app)
        return this.engine.handleInteraction(app, pixel, this.color)
    }

    private getStorageKey(key: string): string {
        return `${this.world}::${key}`
    }
}
