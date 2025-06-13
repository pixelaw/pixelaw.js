import { KeysClause, type SDK } from "@dojoengine/sdk"
import {
    type Bounds,
    type Coordinate,
    type Pixel,
    type PixelStore,
    type PixelStoreEvents,
    type PixelawCore,
    areBoundsEqual,
    makeString,
} from "@pixelaw/core"
import mitt from "mitt"
import type { DojoEngine } from "./DojoEngine.ts"
import type { SchemaType } from "./generated/models.gen.ts"
import { getQueryBounds } from "./utils/querybuilder.ts"
import { convertFullHexString } from "./utils/utils.ts"

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
        const engine = core._engine as DojoEngine
        this.sdk = engine.dojoSetup.sdk
        this.toriiUrl = engine.dojoSetup.toriiUrl
        this.core = core

        this.core.events.on("boundsChanged", (newBounds: Bounds) => {
            this.prepare(newBounds)
        })
    }

    public static async getInstance(core: PixelawCore): Promise<DojoSqlPixelStore> {
        if (!DojoSqlPixelStore.instance) {
            DojoSqlPixelStore.instance = new DojoSqlPixelStore(core)
            const engine = core._engine as DojoEngine

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
                KeysClause(["pixelaw-Pixel"], [undefined], "VariableLen").build(),
                (data) => {
                    try {
                        console.log("pixel from sub", data)
                        const p = data["models"]["pixelaw-Pixel"]
                        const id = data["hashed_keys"]
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
                                x: p.position.value.x.value,
                                y: p.position.value.y.value,
                            }

                            const key = `${pixel.x}_${pixel.y}`
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

    // public applyOptimisticState(pixel: Pixel): void {
    //     const newQueryBounds = getQueryBounds(newBounds)

    //     if (!this.queryBounds || !areBoundsEqual(this.queryBounds, newQueryBounds)) {
    //         this.queryBounds = newQueryBounds
    //         this.refresh()
    //     }
    // }

    public prepare(newBounds: Bounds): void {
        const newQueryBounds = getQueryBounds(newBounds)

        if (!this.queryBounds || !areBoundsEqual(this.queryBounds, newQueryBounds)) {
            this.queryBounds = newQueryBounds
            this.refresh()
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
        console.log("setPixel", key, pixel)
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

    public setPixels(pixels: Pixel[]): void {
        for (const p of pixels) {
            this.setPixel(`${p.x}_${p.y}`, p)
        }
        this.eventEmitter.emit("cacheUpdated", Date.now())
        console.log("p up")
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

    let result = `SELECT
                      json_array(P.color, ltrim(substr(P.text, 32), '0'), ltrim(substr(P.action, 3), '0'), (P."position.x" << 16) | P."position.y", ltrim(substr(A.name, 4), '0' )) as d
                  FROM "pixelaw-Pixel" as P
                           INNER JOIN "Pixelaw-App" as A
                                      ON P.app = A.system
                  WHERE (P."position.x" >= ${left} AND P."position.y" >= ${top} AND P."position.x" <= ${right} AND P."position.y" <= ${bottom} )
                  `

    result += ";"
    return result
}

export default DojoSqlPixelStore
