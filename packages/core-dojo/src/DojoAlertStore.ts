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
    type Coordinate,
} from "@pixelaw/core"
import mitt from "mitt"
import type { DojoStuff } from "./DojoEngine.init.ts"
import type { SchemaType } from "./generated/models.gen.ts"
import type { EntityKeysClause } from "@dojoengine/torii-client"
import { getQueryBounds } from "./utils/querybuilder.ts"
import type { DojoEngine } from "./DojoEngine.ts"
import { convertFullHexString } from "./utils/utils.ts"

type State = { [key: string]: Alert | undefined }

const QUERY_RADIUS = 20

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
            const items = await queryTorii(
                this.toriiUrl,
                createSqlQueryByRadius(this.core.getCenter(), QUERY_RADIUS),
                (rows: any[]) => {
                    return rows.map((item) => {
                        // const item = JSON.parse(str.d)
                        return {
                            ...item,
                            message: convertFullHexString(item.message),
                            timestamp: Number.parseInt(item.timestamp, 16),
                        } as Alert
                    })
                },
            )
            for (const item of items) {
                this.setAlert(item.id, item)
                this.eventEmitter.emit("added", item)
            }
        } catch (e) {
            console.error(e)
        }
    }

    private async subscribe() {
        if (this.isSubscribed) return
        try {
            const subscription = this.sdk.client.onEventMessageUpdated(
                [KeysClause(["pixelaw-Alert"], [undefined], "VariableLen").build() as unknown as EntityKeysClause],
                (id, data) => {
                    if (id === "0x0") return
                    try {
                        const item = data["pixelaw-Alert"]
                        const alert: Alert = {
                            caller: item.caller.value,
                            player: item.player.value,
                            position: {
                                x: item.position.value.x.value,
                                y: item.position.value.y.value,
                            },
                            message: convertFullHexString(item.message.value),
                            timestamp: Number.parseInt(item.timestamp.value, 16),
                        }
                        // console.log("alert", alert)
                        // TODO decide if we store the Alert or not
                        // this.setAlert(item.id.value, alert)
                        this.core.events.emit("alert", alert)
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

    getLastForPosition(position: Position): Alert[] {
        return []
    }
}
export function createSqlQueryByRadius(center: Coordinate, radius: number) {
    let result = `SELECT
                      caller, player, message, "position.x" , "position.y", timestamp
                  FROM "pixelaw-Alert"
                  WHERE (("position.x" - ${center[0]}) * ("position.x" - ${center[0]}) + ("position.y" -  ${center[1]}) * ("position.y" -  ${center[1]})) <= (${radius} * ${radius})
    `

    result += ";"
    return result
}
export function createSqlQuery(bounds: Bounds) {
    const [[left, top], [right, bottom]] = bounds

    let result = `SELECT
                      json_array(A.caller, A.player, ltrim(substr(A.message, 4), '0'), (A.x << 16) | A.y, A.timestamp) as d
                  FROM "pixelaw-Alert" as A
                  WHERE (A.x >= ${left} AND A.y >= ${top} AND A.x <= ${right} AND A.y <= ${bottom} )
                  `

    result += ";"
    return result
}
