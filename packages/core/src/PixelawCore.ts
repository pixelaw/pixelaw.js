import type {
    NotificationStore,
    AppStore,
    BaseWallet,
    Coordinate,
    CoreDefaults,
    CoreStatus,
    Engine,
    EngineConstructor,
    Executor,
    Interaction,
    InteractParams,
    Pixel,
    PixelCoreEvents,
    PixelStore,
    QueueItem,
    QueueStore,
    TileStore,
    UpdateService,
    Wallet,
    WorldConfig,
    WorldsRegistry,
} from "./types.ts"

import mitt from "mitt"
import { createStorage, type Storage, type StorageValue } from "unstorage"
import nullDriver from "unstorage/drivers/null"
import Canvas2DRenderer from "./renderers/Canvas2DRenderer"

export class PixelawCore {
    _status: CoreStatus = "uninitialized"
    worldConfig: WorldConfig = null!
    _engine: Engine = null!
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    appStore: AppStore = null!
    updateService: UpdateService = null!
    viewPort: Canvas2DRenderer = null!
    events = mitt<PixelCoreEvents>()
    queue: QueueStore = null!
    executor: Executor | null = null!
    notification: NotificationStore | null = null!

    private _worldsRegistry: WorldsRegistry
    private _app: string | null = null
    private _color = 0
    private _zoom = 1
    private _lastNotification = 0
    private _center: Coordinate = [0, 0]
    private _world: string

    private engines: Record<string, EngineConstructor<Engine>> = {}

    private _wallet: Wallet | BaseWallet | null = null
    private _account: unknown | null
    readonly storage: Storage<StorageValue>

    constructor(
        engines: Record<string, EngineConstructor<Engine>>,
        worldsRegistry: WorldsRegistry,
        storage: Storage<StorageValue> = createStorage({ driver: nullDriver() }),
    ) {
        this.engines = engines

        this._worldsRegistry = worldsRegistry

        this.storage = storage
    }

    public set account(newAccount: unknown | null) {
        this._account = newAccount
        this.events.emit("accountChanged", newAccount)

        if (newAccount) {
            this.status = "ready"
            this.executor.account = newAccount
        } else {
            this.status = "readyWithoutWallet"
        }
    }
    public get account() {
        return this._account
    }

    public getExecutor(): Executor | null {
        return this.executor
    }

    public get wallet(): Wallet | BaseWallet | null {
        return this._wallet
    }

    public set wallet(wallet: Wallet | null) {
        if (wallet === this._wallet) return

        this._wallet = wallet
        console.log("setWallet", this._wallet)
        this.events.emit("walletChanged", wallet)

        this.storage.setItem(this.getStorageKey("wallet"), JSON.stringify(wallet)).catch(console.error)

        // Also set account to null, since it relies on wallet
        // this.account = account
    }

    public get engineId(): string | null {
        return this._engine ? this._engine.constructor.name : null
    }

    public get engine(): Engine | null {
        return this._engine
    }

    private async getStorageDefaults(): Promise<CoreDefaults | undefined> {
        // Use Promise.all to fetch all items concurrently, improving time efficiency
        const [app, color, center, zoom] = await Promise.all([
            this.storage.getItem(this.getStorageKey("app")),
            this.storage.getItem(this.getStorageKey("color")),
            this.storage.getItem(this.getStorageKey("center")),
            this.storage.getItem(this.getStorageKey("zoom")),
        ])

        // Check for undefined values directly, improving readability
        if (app !== null && color !== null && center !== null && zoom !== null) {
            return {
                app: app as string,
                color: color as unknown as number,
                center: center as unknown as number[],
                zoom: zoom as unknown as number,
            }
        }
    }

    public async loadWorld(world: string, urlDefaults?: CoreDefaults) {
        console.log("loading loadWorld")

        if (!Object.prototype.hasOwnProperty.call(this._worldsRegistry, world))
            throw Error(`World ${world} does not exist in registry`)

        this.status = "loadConfig"
        const worldConfig = this._worldsRegistry[world]

        const engineClass = this.engines[worldConfig.engine.toLowerCase()]

        if (!engineClass) {
            throw new Error(`Unsupported engine: ${worldConfig.engine}`)
        }

        this._engine = new engineClass(this)

        this.status = "initEngine"

        // Engine init will access some core setters, so stuff may change
        await this._engine.init(worldConfig.config)

        this.world = world

        const storageDefaults = await this.getStorageDefaults()

        const defaults = urlDefaults ?? storageDefaults ?? worldConfig.defaults
        if (defaults) {
            this.app = defaults.app
            this.color = defaults.color
            this.center = defaults.center as Coordinate
            this.zoom = defaults.zoom
        }

        // TODO load lastNotification?

        this.viewPort = new Canvas2DRenderer(this)

        this.worldConfig = worldConfig

        this.events.emit("engineChanged", this._engine)
        // Try to get the Wallet
        const baseWallet = await this.storage.getItem(this.getStorageKey("wallet"))
        if (baseWallet) {
            console.log("loading basewallet")
            this.wallet = baseWallet as unknown as Wallet

            this.status = "initAccount"
        } else {
            this.status = "readyWithoutWallet"
        }

        this.events.on("centerChanged", (newCenter: Coordinate) => {
            this.center = newCenter
        })

        this.events.on("zoomChanged", (newZoom: number) => {
            this.zoom = newZoom
        })
    }

    public get status(): CoreStatus {
        return this._status
    }
    private set status(newStatus: CoreStatus) {
        this._status = newStatus
        this.events.emit("statusChanged", newStatus)

        console.info("core.setStatus", newStatus)
    }

    public get worldsRegistry(): WorldsRegistry {
        return this._worldsRegistry
    }

    public get app(): string | null {
        return this._app
    }

    public set app(newApp: string | null) {
        this._app = newApp
        this.events.emit("appChanged", newApp)
        this.storage.setItem(this.getStorageKey("app"), newApp).catch(console.error)
    }

    private set world(newWorld: string) {
        this._world = newWorld
        this.storage.setItem(this.getStorageKey("world"), newWorld).catch(console.error)
        this.events.emit("worldChanged", newWorld)
    }

    public get color(): number {
        return this._color
    }

    public set color(newColor: number | null) {
        this._color = newColor
        this.events.emit("colorChanged", newColor)
        this.storage.setItem(this.getStorageKey("color"), newColor.toString()).catch(console.error)
    }

    public get zoom(): number {
        return this._zoom
    }

    public set zoom(newZoom: number) {
        if (this._zoom === newZoom) return
        this._zoom = newZoom
        this.events.emit("zoomChanged", newZoom)
        this.storage.setItem(this.getStorageKey("zoom"), newZoom.toString()).catch(console.error)
    }

    public set lastNotification(newLastNotification: number) {
        if (this._lastNotification === newLastNotification) return
        this._lastNotification = newLastNotification
        this.storage.setItem(this.getStorageKey("lastNotification"), newLastNotification).catch(console.error)
    }

    public get lastNotification(): number {
        return this._lastNotification
    }

    public get center(): Coordinate {
        return this._center
    }

    public set center(newCenter: Coordinate) {
        if (this._center === newCenter) return
        this._center = newCenter
        this.events.emit("centerChanged", newCenter)
        this.storage.setItem(this.getStorageKey("center"), JSON.stringify(newCenter)).catch(console.error)
    }

    public get world(): string {
        return this._world
    }

    public async prepInteraction(coordinate: Coordinate): Promise<Interaction> {
        return await this._engine.prepInteraction(coordinate)
    }

    // public async executeInteraction(interaction: Interaction): Promise<void> {
    //     return await this.engine.executeInteraction(interaction)
    // }

    // public async handleInteraction(coordinate: Coordinate): Promise<Interaction> {
    //     const pixel = this.pixelStore.getPixel(coordinate) ?? ({ x: coordinate[0], y: coordinate[1] } as Pixel)
    //     const app = this.appStore.getByName(this.app)
    //     return await this.engine.handleInteraction(app, pixel, this.color)
    // }

    // TODO finalize return type etc
    public async executeQueueItem(queueItem: QueueItem): Promise<boolean> {
        return await this._engine.executeQueueItem(queueItem)
    }

    private getStorageKey(key: string): string {
        return `${this._world}::${key}`
    }
}
