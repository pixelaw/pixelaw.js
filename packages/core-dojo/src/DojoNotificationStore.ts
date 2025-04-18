import { KeysClause, type SDK } from "@dojoengine/sdk"
import { queryTorii } from "@dojoengine/sdk/sql"
import {
    type NotificationStore,
    type Notification,
    QueueStore,
    type NotificationStoreEvents,
    type Bounds,
    MAX_DIMENSION,
    areBoundsEqual,
    type PixelawCore,
    type Coordinate,
    type Position,
} from "@pixelaw/core"
import mitt from "mitt"
import type { DojoStuff } from "./DojoEngine.init.ts"
import type { SchemaType } from "./generated/models.gen.ts"
import type { EntityKeysClause } from "@dojoengine/torii-client"
import { getQueryBounds } from "./utils/querybuilder.ts"
import type { DojoEngine } from "./DojoEngine.ts"
import { convertFullHexString } from "./utils/utils.ts"

type State = { [key: string]: Notification | undefined }

const QUERY_RADIUS = 20

export class DojoNotificationStore implements NotificationStore {
    public readonly eventEmitter = mitt<NotificationStoreEvents>()
    private dojoStuff
    private sdk: SDK<SchemaType>
    private static instance: DojoNotificationStore
    private isSubscribed = false
    private cacheUpdated: number = Date.now()
    private state: State = {}
    private toriiUrl
    private queryBounds: Bounds | null = null
    private core: PixelawCore

    protected constructor(core: PixelawCore) {
        const engine = core._engine as DojoEngine
        this.sdk = engine.dojoSetup.sdk
        this.toriiUrl = engine.dojoSetup.toriiUrl
        this.core = core
    }

    // Singleton factory
    public static async getInstance(core: PixelawCore): Promise<DojoNotificationStore> {
        if (!DojoNotificationStore.instance) {
            DojoNotificationStore.instance = new DojoNotificationStore(core)

            await DojoNotificationStore.instance.subscribe()
            await DojoNotificationStore.instance.initialize()
        }
        return DojoNotificationStore.instance
    }

    private async initialize() {
        try {
            // TODO Notifications should be filtered by wallet address
            // const wallet = this.core.wallet as DojoWallet

            const items = await queryTorii(
                this.toriiUrl,
                createSqlQueryByRadius(
                    this.core.center,
                    QUERY_RADIUS,
                    this.core.lastNotification /*,  wallet.getAccount()*/,
                ),
                (rows: any[]) => {
                    return rows.map((item) => {
                        // const item = JSON.parse(str.d)
                        return {
                            ...item,
                            message: convertFullHexString(item.text),
                        } as Notification
                    })
                },
            )
            for (const item of items) {
                // this.setNotification(item.id, item)
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
                [
                    KeysClause(
                        ["pixelaw-Notification"],
                        [undefined],
                        "VariableLen",
                    ).build() as unknown as EntityKeysClause,
                ],
                (id, data) => {
                    if (id === "0x0") return
                    try {
                        const item = data["pixelaw-Notification"]
                        console.log(item)
                        const notification: Notification = {
                            from: item.from.value.option === "None" ? null : item.from.value.value.value,
                            to: item.to.value.option === "None" ? null : item.to.value.value.value,
                            color: item.color.value,
                            app: item.app.value, // TODO
                            position: {
                                x: item.position.value.x.value,
                                y: item.position.value.y.value,
                            },
                            text: convertFullHexString(item.text.value),
                        }
                        // console.log("notification", notification)
                        // TODO decide if we store the Notification or not
                        // this.setNotification(item.id.value, notification)
                        this.core.events.emit("notification", notification)
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

    public setNotification(key: string, Notification: Notification): void {
        this.state[key] = Notification
    }

    getAll(): Notification[] {
        return this.dojoStuff!.apps
    }

    public setBounds(newBounds: Bounds): void {
        const newQueryBounds = getQueryBounds(newBounds)

        if (!this.queryBounds || !areBoundsEqual(this.queryBounds, newQueryBounds)) {
            this.queryBounds = newQueryBounds
        }
    }

    getLastForPosition(position: Position): Notification[] {
        return []
    }
}
export function createSqlQueryByRadius(center: Coordinate, radius: number, lastNotification: number, address: string) {
    console.log("add", address)
    let result = `SELECT
                      "from", "to", "text", "position.x" , "position.y", "color"
                  FROM "pixelaw-Notification"
                  WHERE (("position.x" - ${center[0]}) * ("position.x" - ${center[0]}) + ("position.y" -  ${center[1]}) * ("position.y" -  ${center[1]})) <= (${radius} * ${radius})
    `

    result += ";"
    return result
}
/*

export function createSqlQuery(bounds: Bounds) {
    const [[left, top], [right, bottom]] = bounds

    let result = `SELECT
                      json_array(A.caller, A.player, ltrim(substr(A.message, 4), '0'), (A.x << 16) | A.y, A.timestamp) as d
                  FROM "pixelaw-Notification" as A
                  WHERE (A.x >= ${left} AND A.y >= ${top} AND A.x <= ${right} AND A.y <= ${bottom} )
                  `

    result += ";"
    return result
}
*/
