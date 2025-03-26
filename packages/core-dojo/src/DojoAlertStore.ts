import { KeysClause, type SDK } from "@dojoengine/sdk"
import { queryTorii } from "@dojoengine/sdk/sql"
import {
    type AlertStore,
    type Alert,
    QueueStore,
    type AlertStoreEvents,
    type Bounds,
    MAX_DIMENSION,
    areBoundsEqual,
    type PixelawCore,
} from "@pixelaw/core"
import mitt from "mitt"
import type { DojoStuff } from "./DojoEngine.init.ts"
import type { SchemaType } from "./generated/models.gen.ts"
import type { EntityKeysClause } from "@dojoengine/torii-client"
import { getQueryBounds } from "./utils/querybuilder.ts"
import type { DojoEngine } from "./DojoEngine.ts"

type State = { [key: string]: Alert | undefined }

export class DojoAlertStore implements AlertStore {
    public readonly eventEmitter = mitt<AlertStoreEvents>()
    private dojoStuff
    private sdk: SDK<SchemaType>
    private static instance: DojoAlertStore
    private isSubscribed = false
    private cacheUpdated: number = Date.now()
    private state: State = {}
    private toriiUrl
    private queryBounds: Bounds | null = null
    private core: PixelawCore

    protected constructor(core: PixelawCore) {
        const engine = core.engine as DojoEngine
        this.sdk = engine.dojoSetup.sdk
        this.toriiUrl = engine.dojoSetup.toriiUrl
        this.core = core
    }

    // Singleton factory
    public static async getInstance(core: PixelawCore): Promise<DojoAlertStore> {
        if (!DojoAlertStore.instance) {
            DojoAlertStore.instance = new DojoAlertStore(core)

            await DojoAlertStore.instance.subscribe()
            await DojoAlertStore.instance.initialize()
        }
        return DojoAlertStore.instance
    }

    private async initialize() {
        try {
            const items = await queryTorii(this.toriiUrl, createSqlQuery(this.queryBounds), (rows: any[]) => {
                return rows.map((item) => {
                    return {
                        ...item,
                        calldata: JSON.parse(item.calldata),
                    }
                })
            })
            for (const item of items) {
                this.setAlert(item.id, item)
                this.eventEmitter.emit("added", item)
            }
            // console.log({ items })
        } catch (e) {
            console.error(e)
        }
    }

    private async subscribe() {
        if (this.isSubscribed) return
        try {
            const subscription = this.sdk.client.onEventMessageUpdated(
                [
                    KeysClause(
                        ["pixelaw-QueueScheduled"],
                        [undefined],
                        "VariableLen",
                    ).build() as unknown as EntityKeysClause,
                ],
                false,
                (id, data) => {
                    if (id === "0x0") return
                    try {
                        const item = data["pixelaw-QueueScheduled"]

                        const Alert: Alert = {
                            calldata: item.calldata.value.map((val) => val.value),
                            called_system: item.called_system.value,
                            id: item.id.value,
                            selector: item.selector.value,
                            timestamp: item.timestamp.value,
                        }
                        this.setAlert(item.id.value, Alert)
                        this.eventEmitter.emit("scheduled", Alert)
                    } catch (e) {
                        console.error(e)
                    }

                    this.cacheUpdated = Date.now()
                },
            )

            this.isSubscribed = true
            return () => {
                console.log("cancel")
                subscription.cancel()
                this.isSubscribed = false
            }
        } catch (error) {
            console.error("Subscription error:", error)
        }
    }

    public setAlert(key: string, Alert: Alert): void {
        this.state[key] = Alert
    }
    getAll(): Alert[] {
        return this.dojoStuff!.apps
    }
    public setBounds(newBounds: Bounds): void {
        const newQueryBounds = getQueryBounds(newBounds)

        if (!this.queryBounds || !areBoundsEqual(this.queryBounds, newQueryBounds)) {
            this.queryBounds = newQueryBounds
        }
    }
}

export function createSqlQuery(bounds: Bounds) {
    const [[left, top], [right, bottom]] = bounds
    const xWraps = right - left < 0
    const yWraps = bottom - top < 0
    let result = `SELECT
                      json_array(A.caller, A.player, ltrim(substr(P.message, 4), '0'), (A.x << 16) | A.y, A.timestamp) as d
                  FROM "pixelaw-Alert" as A
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
