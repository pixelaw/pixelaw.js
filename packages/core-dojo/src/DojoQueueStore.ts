import {KeysClause, type SDK} from "@dojoengine/sdk"
import {queryTorii} from "@dojoengine/sdk/sql"
import type {QueueItem, QueueStore, QueueStoreEvents} from "@pixelaw/core"
import mitt from "mitt"
import type {DojoStuff} from "./DojoEngine.init.ts"
import type {SchemaType} from "./generated/models.gen.ts"
import type {EntityKeysClause} from "@dojoengine/torii-client"

type State = { [key: string]: QueueItem | undefined }

export class DojoQueueStore implements QueueStore {
    public readonly eventEmitter = mitt<QueueStoreEvents>()
    private dojoStuff
    private sdk: SDK<SchemaType>
    private static instance: DojoQueueStore
    private isSubscribed = false
    private cacheUpdated: number = Date.now()
    private state: State = {}
    private toriiUrl

    protected constructor(toriiUrl: string, dojoStuff: DojoStuff) {
        this.dojoStuff = dojoStuff
        this.sdk = dojoStuff.sdk
        this.toriiUrl = toriiUrl
    }

    // Singleton factory
    public static async getInstance(toriiUrl: string, dojoStuff: DojoStuff): Promise<DojoQueueStore> {
        if (!DojoQueueStore.instance) {
            DojoQueueStore.instance = new DojoQueueStore(toriiUrl, dojoStuff)

            await DojoQueueStore.instance.subscribe()
            await DojoQueueStore.instance.initialize()
        }
        return DojoQueueStore.instance
    }

    private async initialize() {
        try {
            const items = await queryTorii(
                this.toriiUrl,
                `SELECT qs.id, qs.timestamp, qs.called_system, qs.selector, qs.calldata
                FROM "pixelaw-QueueScheduled" qs
                INNER JOIN "pixelaw-QueueItem" qi 
                ON qi.id = qs.id;
                `,
                (rows: any[]) => {
                    return rows.map((item) => {
                        return {
                            ...item,
                            calldata: JSON.parse(item.calldata),
                        }
                    })
                },
            )
            for (const item of items) {
                console.log("INITIAL", item.id)
                this.setQueueItem(item.id, item)
                this.eventEmitter.emit("scheduled", item)
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

                        const queueItem: QueueItem = {
                            calldata: item.calldata.value.map((val) => val.value),
                            called_system: item.called_system.value,
                            id: item.id.value,
                            selector: item.selector.value,
                            timestamp: item.timestamp.value,
                        }
                        this.setQueueItem(item.id.value, queueItem)
                        this.eventEmitter.emit("scheduled", queueItem)
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
    public setQueueItem(key: string, queueItem: QueueItem): void {
        this.state[key] = queueItem
    }
    getAll(): QueueItem[] {
        return this.dojoStuff!.apps
    }
}
