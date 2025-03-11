import {KeysClause, type SDK} from "@dojoengine/sdk"
import type {EntityKeysClause} from "@dojoengine/torii-client"
import type {QueueItem, QueueStore, QueueStoreEvents} from "@pixelaw/core"
import mitt from "mitt"
import type {DojoStuff} from "./DojoEngine.init.ts"
import type {SchemaType} from "./generated/models.gen.ts"

type State = { [key: string]: QueueItem | undefined }

export class DojoQueueStore implements QueueStore {
    public readonly eventEmitter = mitt<QueueStoreEvents>()
    private dojoStuff
    private sdk: SDK<SchemaType>
    private static instance: DojoQueueStore
    private isSubscribed = false
    private cacheUpdated: number = Date.now()
    private state: State = {}

    protected constructor(dojoStuff: DojoStuff) {
        this.dojoStuff = dojoStuff
        this.sdk = dojoStuff.sdk
    }

    // Singleton factory
    public static async getInstance(dojoStuff: DojoStuff): Promise<DojoQueueStore> {
        if (!DojoQueueStore.instance) {
            const instance = new DojoQueueStore(dojoStuff)

            instance.subscribe()
            DojoQueueStore.instance = instance
        }
        return DojoQueueStore.instance
    }

    private async subscribe() {
        if (this.isSubscribed) return

        try {
            const subscription = this.sdk.client.onEventMessageUpdated(
                [KeysClause([], [undefined], "VariableLen").build() as unknown as EntityKeysClause],
                false,
                (id, data) => {
                    if (id === "0x0") return
                    try {
                        console.log(data)
                        const q = data["pixelaw-QueueScheduled"]

                        const queueItem: QueueItem = {
                            calldata: q.calldata.value,
                            called_system: q.called_system.value,
                            id: q.id.value,
                            selector: q.selector.value,
                            timestamp: q.timestamp.value,
                        }
                        this.setQueueItem(q.id.value, queueItem)
                    } catch (e) {
                        console.error(e)
                    }

                    this.cacheUpdated = Date.now()
                },
            )

            const subscription2 = this.sdk.client.onEntityUpdated(
                [
                    {
                        Keys: {
                            pattern_matching: "VariableLen",
                            keys: [undefined],
                            models: ["pixelaw-QueueItem"],
                        },
                    },
                ],
                (id, data) => {
                    if (id === "0x0") return
                    try {
                        console.log(data)
                        // const q = data["pixelaw-QueueItem"]
                        // const queueItem: QueueItem = {
                        //     calldata: "",
                        //     called_system: "",
                        //     id: q.id.value,
                        //     selector: "",
                        //     timestamp: 0,
                        // }
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
