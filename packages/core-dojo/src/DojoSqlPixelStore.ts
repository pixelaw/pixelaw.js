import type {SDK} from "@dojoengine/sdk"
import {
    areBoundsEqual,
    type Bounds,
    type Coordinate,
    makeString,
    MAX_DIMENSION,
    type Pixel,
    type PixelStore,
    type PixelStoreEvents,
} from "@pixelaw/core"
import mitt from "mitt"
import type {SchemaType} from "./generated/models.gen.ts"
import {buildSubscriptionQuery, getQueryBounds} from "./utils/querybuilder.ts"
import {convertFullHexString} from "./utils/utils.ts"

type State = { [key: string]: Pixel | undefined }

export function createSqlQuery(bounds: Bounds) {
    const [[left, top], [right, bottom]] = bounds
    const xWraps = right - left < 0
    const yWraps = bottom - top < 0
    let result = `SELECT json_array(color, ltrim(substr(text, 3), '0'), ltrim(substr(action, 3), '0'), (x << 16) | y ) as d FROM "pixelaw-Pixel" WHERE( 1 = 0 ) `
    const ZERO = 0

    if (xWraps && yWraps) {
        result += ` OR(x >= ${left} AND y >= ${top} AND x <= ${MAX_DIMENSION} AND y <= ${MAX_DIMENSION} )`
        result += ` OR(x >= ${left} AND y >= ${ZERO} AND x <= ${MAX_DIMENSION} AND y <= ${bottom} )`
        result += ` OR(x >= ${ZERO} AND y >= ${top} AND x <= ${right} AND y <= ${MAX_DIMENSION} )`
        result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`
    } else if (xWraps) {
        result += ` OR(x >= ${left} AND y >= ${ZERO} AND x <= ${MAX_DIMENSION} AND y <= ${bottom} )`
        result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`
    } else if (yWraps) {
        result += ` OR(x >= ${ZERO} AND y >= ${top} AND x <= ${right} AND y <= ${MAX_DIMENSION} )`
        result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`
    } else {
        result += ` OR(x >= ${top} AND y >= ${top} AND x <= ${right} AND y <= ${bottom} )`
    }
    result += ";"
    return result
}

class DojoSqlPixelStore implements PixelStore {
    public readonly eventEmitter = mitt<PixelStoreEvents>()
    private static instance: DojoSqlPixelStore
    private state: State = {}
    private queryBounds: Bounds | null = null
    private cacheUpdated: number = Date.now()
    private isSubscribed = false
    private sdk: SDK<SchemaType>
    private worker: any // Worker type for both environments
    private toriiUrl: string

    protected constructor(toriiUrl: string, sdk: SDK<SchemaType>) {
        this.sdk = sdk
        this.toriiUrl = toriiUrl
    }

    public static async getInstance(toriiUrl: string, sdk: SDK<SchemaType>): Promise<DojoSqlPixelStore> {
        if (!DojoSqlPixelStore.instance) {
            const instance = new DojoSqlPixelStore(toriiUrl, sdk)

            if (typeof window !== "undefined" && Object.keys(window).length !== 0) {
                // Browser environment
                const workerUrl = new URL("./DojoSqlPixelStore.webworker.ts", import.meta.url)
                instance.worker = new Worker(workerUrl, { type: "module" })
                console.log("worker")
            } else {
                // Node.js environment
                const { Worker } = await import("node:worker_threads")
                const { fileURLToPath } = await import("node:url")
                const path = await import("node:path")
                const __filename = fileURLToPath(import.meta.url)
                const __dirname = path.dirname(__filename)
                const workerPath = path.resolve(__dirname, "./DojoSqlPixelStore.webworker.ts")
                instance.worker = new Worker(workerPath, { workerData: { toriiUrl } })
            }

            instance.worker.onmessage = instance.handleRefreshWorker.bind(instance)
            instance.subscribe()
            DojoSqlPixelStore.instance = instance
        }
        return DojoSqlPixelStore.instance
    }

    private async subscribe() {
        if (this.isSubscribed) return

        try {
            const [initialEntities, subscription] = await this.sdk.subscribeEntityQuery({
                // @ts-ignore TODO fix the type of query. it seems to trigger on non-pixel updates too still
                query: buildSubscriptionQuery(),
                callback: (response) => {
                    console.log("cb")
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error)
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        const p = response.data[0].models.pixelaw.Pixel
                        const key = `${p?.x}_${p?.y}`
                        console.log(p)
                        if (p?.text) {
                            p.text = convertFullHexString(p.text)
                        }
                        if (p?.action) {
                            p.action = convertFullHexString(p.action)
                        }

                        this.setPixel(key, p as Pixel)
                        this.eventEmitter.emit("cacheUpdated", Date.now())
                    }
                    this.cacheUpdated = Date.now()
                },
            })

            this.isSubscribed = true
            return () => {
                subscription.cancel()
                this.isSubscribed = false
            }
        } catch (error) {
            console.error("Subscription error:", error)
        }
    }

    private handleRefreshWorker(event: MessageEvent) {
        const { success, data, error } = event.data
        if (success) {
            this.state = { ...this.state, ...data }

            this.eventEmitter.emit("cacheUpdated", Date.now())
            console.log("pixels in cache: ", Object.keys(this.state).length)
        } else {
            console.error("RefreshWorker error:", error)
        }
    }

    public refresh(): void {
        if (!this.queryBounds) return
        const q = createSqlQuery(this.queryBounds)

        const query = encodeURIComponent(q)

        this.worker.postMessage({ query, toriiUrl: this.toriiUrl })
    }

    public prepare(newBounds: Bounds): void {
        const newQueryBounds = getQueryBounds(newBounds)

        if (!this.queryBounds || !areBoundsEqual(this.queryBounds, newQueryBounds)) {
            this.queryBounds = newQueryBounds
        }
    }

    public getPixel(coord: Coordinate): Pixel | undefined {
        const key = `${coord[0]}_${coord[1]}`
        return this.state[key]
    }

    public setPixel(key: string, pixel: Pixel): void {
        this.state[key] = pixel
    }

    public setPixelColor(coord: Coordinate, color: number): void {
        const key = makeString(coord)
        let pixel = this.state[key]

        if (!pixel) {
            pixel = {
                action: "",
                color: color,
                owner: "",
                text: "",
                timestamp: Date.now(),
                x: coord[0],
                y: coord[1],
            } as Pixel
        } else {
            pixel = {
                ...pixel,
                color,
            }
        }

        this.setPixel(key, pixel)
    }

    public setPixels(pixels: { key: string; pixel: Pixel }[]): void {
        for (const { key, pixel } of pixels) {
            this.setPixel(key, pixel)
        }
    }

    public updateCache() {}

    public setCacheUpdated(value: number): void {
        this.cacheUpdated = value
    }

    public getCacheUpdated(): number {
        return this.cacheUpdated
    }
}

export default DojoSqlPixelStore
