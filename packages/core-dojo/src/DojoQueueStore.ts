import type {SDK} from "@dojoengine/sdk"
import type {QueueItem, QueueStore, QueueStoreEvents} from "@pixelaw/core"
import mitt from "mitt"
import type {DojoStuff} from "./DojoEngine.init.ts"
import type {SchemaType} from "./generated/models.gen.ts"
import {buildSubscriptionQuery} from "./utils/querybuilder.ts"

export class DojoQueueStore implements QueueStore {
    public readonly eventEmitter = mitt<QueueStoreEvents>()
    private dojoStuff
    private sdk: SDK<SchemaType>
    private static instance: DojoQueueStore
    private isSubscribed = false
    private cacheUpdated: number = Date.now()

    constructor(dojoStuff: DojoStuff) {
        this.dojoStuff = dojoStuff
        this.sdk = dojoStuff.sdk
    }

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
            const [initialEntities, subscription] = await this.sdk.subscribeEntityQuery({
                // @ts-ignore TODO fix the type of query. it seems to trigger on non-pixel updates too still
                query: buildSubscriptionQuery(),
                callback: (response) => {
                    console.log("cb")
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error)
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        console.log(response)
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

    getAll(): QueueItem[] {
        return this.dojoStuff!.apps
    }
}
