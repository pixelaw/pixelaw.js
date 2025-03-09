import type mitt from "mitt"
import type {PixelawCore} from "./PixelawCore.ts"

export type Pixel = {
    action: string
    color: number | string
    owner: string
    text: string
    timestamp: number | string
    x: number
    y: number
}

export type App = {
    system: string
    name: string
    icon: string
    action: string
    plugin: string
    entity: {
        id: string
    }
}

export type Variant = {
    name: string
    value: number
}

export type Param = {
    name: string
    type: "string" | "number" | "enum"
    typeName: string | null
    variants: Variant[]
    transformer: () => void
    value?: number | null
    systemOnly?: boolean
}

export type Tile = HTMLImageElement

export interface UpdateService {
    // tileChanged: TileChangedMessage | null
    setBounds: (newBounds: Bounds) => void
}

export interface AppStore {
    getByName: (name: string) => App | undefined
    getAll: () => App[]
}

// TODO this is rough and maybe dojo centric
export type QueueItem = {
    id: string
    timestamp: number
    called_system: string
    selector: string
    calldata: string
}

export interface QueueStore {
    getAll: () => QueueItem[]
}

export interface TileStore {
    refresh: () => void
    prepare: (bounds: Bounds) => void
    // fetchTile: (key: string) => void
    // getTile: (key: string) => Tile | undefined | "";
    // setTile: (key: string, tile: Tile) => Promise<void>;
    setTiles: (tiles: { key: string; tile: Tile }[]) => Promise<void>
    tileset: Tileset | null
    cacheUpdated: number
}

export interface Interaction {
    action: (params: Param[]) => void
    dialog: HTMLDialogElement | null
}

export interface Tileset {
    tileSize: number
    scaleFactor: number
    bounds: Bounds
    tileRows: (Tile | undefined | "")[][]
}

export type Dimension = [width: number, height: number]

// Used internally
export type Coordinate = [number, number]

// Used for SmartContracts
export type Position = {
    x: number
    y: number
}

export type Bounds = [topLeft: Coordinate, bottomRight: Coordinate]

// export const MAX_DIMENSION: number = 4_294_967_295
export const MAX_DIMENSION: number = 32_767 // 2**15 -1

// Don't query everytime bounds change, but only when the buffer resolution changes
// So when bounds change from 5 to 6, but Buffer is 10, no requery happens
export const QUERY_BUFFER: number = 10

export const TILESIZE = 100

// TODO handle scalefactor 10 later
export const DEFAULT_SCALEFACTOR = 1

export function makeString<Coordinate>(coordinate: Coordinate): string {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) {
        throw new Error("Invalid coordinate")
    }
    return `${coordinate[0]}_${coordinate[1]}`
}

export type PixelCoreEvents = {
    cellClicked: Coordinate
    cellHovered: Coordinate | undefined
    centerChanged: Coordinate
    worldViewChanged: Bounds
    engineChanged: Engine
    statusChanged: CoreStatus
    walletChanged: Wallet
    pixelStoreUpdated: number
    tileStoreUpdated: number
    appStoreUpdated: number
    userScrolled: { bounds: Bounds }
    userZoomed: { bounds: Bounds }
    cacheUpdated: number
    appChanged: string | null
    worldChanged: string | null
    colorChanged: number
    zoomChanged: number
}

export type EngineStatus = "ready" | "loading" | "error" | "uninitialized"
export type CoreStatus = "uninitialized" | "loadConfig" | "initializing" | "ready" | "error"
export interface Engine {
    id: Engines
    core: PixelawCore
    status: EngineStatus

    init(engineConfig: unknown): Promise<void>
    // setAccount(account: unknown): void
    handleInteraction(app: App, pixel: Pixel, color: number): Promise<Interaction | undefined>
}

export type EngineConstructor<T extends Engine> = new (core: PixelawCore) => T

export interface WalletConfig {
    masterAddress?: string
    masterPrivateKey?: string
    accountClassHash?: string
    rpcUrl?: string
    profileUrl?: string
    url?: string
}

export type WorldsRegistry = Record<string, WorldConfig>

export type Engines = "dojo" | "mud"

export type WorldConfig = {
    engine: Engines
    description: string
    defaults?: CoreDefaults
    config: unknown
}

export type CoreDefaults = {
    app: string
    color: number
    center: number[] // same as Coordinate
    zoom: number
}

export type PixelStoreEvents = {
    cacheUpdated: number
}

export interface PixelStore {
    eventEmitter: ReturnType<typeof mitt<PixelStoreEvents>>
    refresh: () => void
    prepare: (bounds: Bounds) => void
    getPixel: (coordinate: Coordinate) => Pixel | undefined
    setPixelColor: (coord: Coordinate, color: number) => void
    setPixel: (key: string, pixel: Pixel) => void
    setPixels: (pixels: { key: string; pixel: Pixel }[]) => void
    unload?: () => Promise<void>
}

export class BaseWallet {
    engine: string
    id: unknown
    address: string
    chainId: string

    constructor(engine: string, id: string, address: string, chainId: string) {
        this.engine = engine
        this.id = id
        this.address = address
        this.chainId = chainId
    }
}

export abstract class Wallet extends BaseWallet {
    abstract getAccount(): unknown
    abstract toJSON(): unknown
}
