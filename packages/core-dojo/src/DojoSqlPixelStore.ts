import { KeysClause, type SDK } from "@dojoengine/sdk"
import type { EntityKeysClause } from "@dojoengine/torii-client"
import {
    areBoundsEqual,
    type Bounds,
    type Coordinate,
    makeString,
    MAX_DIMENSION,
    type Pixel,
    type PixelawCore,
    type PixelStore,
    type PixelStoreEvents,
} from "@pixelaw/core"
import mitt from "mitt"
import type { SchemaType } from "./generated/models.gen.ts"
import { getQueryBounds } from "./utils/querybuilder.ts"
import { convertFullHexString } from "./utils/utils.ts"
import type { DojoEngine } from "./DojoEngine.ts"

type State = { [key: string]: Pixel | undefined }

class DojoSqlPixelStore implements PixelStore {
    public readonly eventEmitter = mitt<PixelStoreEvents>()
    private static instance: DojoSqlPixelStore
    private state: State = {}
    private idLookupTable: Record<string, string> = {}
    private queryBounds: Bounds | null = null
    private cacheUpdated: number = Date.now()
    private isSubscribed = false
    private sdk: SDK<SchemaType>
    private worker: any
    private toriiUrl: string
    private core: PixelawCore

    protected constructor(core: PixelawCore) {
        const engine = core.engine as DojoEngine
        this.sdk = engine.dojoSetup.sdk
        this.toriiUrl = engine.dojoSetup.toriiUrl
        this.core = core

        this.core.events.on("worldViewChanged", (newBounds: Bounds) => {
            this.prepare(newBounds)
            this.refresh()
        })
    }

    public static async getInstance(core: PixelawCore): Promise<DojoSqlPixelStore> {
        if (!DojoSqlPixelStore.instance) {
            DojoSqlPixelStore.instance = new DojoSqlPixelStore(core)
            const engine = core.engine as DojoEngine

            if (typeof window !== "undefined" && Object.keys(window).length !== 0) {
                // Browser environment
                const workerUrl = new URL("./DojoSqlPixelStore.webworker.js", import.meta.url)
                DojoSqlPixelStore.instance.worker = new Worker(workerUrl, { type: "module" })
                console.log("worker")
            } else {
                // Node.js environment
                const { Worker } = await import("node:worker_threads")
                const { fileURLToPath } = await import("node:url")
                const path = await import("node:path")
                const __filename = fileURLToPath(import.meta.url)
                const __dirname = path.dirname(__filename)
                const workerPath = path.resolve(__dirname, "./DojoSqlPixelStore.webworker.js")
                DojoSqlPixelStore.instance.worker = new Worker(workerPath, {
                    workerData: { toriiUrl: engine.dojoSetup.toriiUrl },
                })
            }

            DojoSqlPixelStore.instance.worker.onmessage = DojoSqlPixelStore.instance.handleRefreshWorker.bind(
                DojoSqlPixelStore.instance,
            )
            DojoSqlPixelStore.instance.subscribe()
        }
        return DojoSqlPixelStore.instance
    }

    private async subscribe() {
        if (this.isSubscribed) return

        try {
            const subscription = this.sdk.client.onEntityUpdated(
                [KeysClause(["pixelaw-Pixel"], [undefined], "VariableLen").build() as unknown as EntityKeysClause],
                (id, data) => {
                    if (id === "0x0") return
                    try {
                        const p = data["pixelaw-Pixel"]

                        if (Object.keys(data).length === 0) {
                            // Pixel got deleted
                            this.deletePixel(this.idLookupTable[id])
                            delete this.idLookupTable[id]
                        } else {
                            const app =
                                p.app.value !== "0x0000000000000000000000000000000000000000000000000000000000000000"
                                    ? this.core.appStore.getBySystem(p.app.value).name
                                    : ""
                            const pixel: Pixel = {
                                action: convertFullHexString(p.action.value),
                                color: p.color.value,
                                owner: "",
                                text: convertFullHexString(p.text.value),
                                timestamp: p.timestamp.value,
                                app,
                                x: p.x.value,
                                y: p.y.value,
                            }

                            const key = `${p?.x.value}_${p?.y.value}`
                            this.idLookupTable[id] = key
                            this.setPixel(key, pixel)
                        }
                    } catch (e) {
                        console.error(e)
                    }

                    this.eventEmitter.emit("cacheUpdated", Date.now())
                    this.cacheUpdated = Date.now()
                },
            )

            this.isSubscribed = true
            return () => {
                console.log("subcancel")
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

    public deletePixel(key: string): void {
        delete this.state[key]
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

export function createSqlQuery(bounds: Bounds) {
    const [[left, top], [right, bottom]] = bounds
    const xWraps = right - left < 0
    const yWraps = bottom - top < 0
    let result = `SELECT
                      json_array(P.color, ltrim(substr(P.text, 32), '0'), ltrim(substr(P.action, 3), '0'), (P.x << 16) | P.y, ltrim(substr(A.name, 4), '0' )) as d
                  FROM "pixelaw-Pixel" as P
                           INNER JOIN "Pixelaw-App" as A
                                      ON P.app = A.system
                  WHERE( 1 = 0 ) 
                  `
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

export default DojoSqlPixelStore
