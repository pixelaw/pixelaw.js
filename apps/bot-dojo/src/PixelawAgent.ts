import "dotenv/config"
import type { CoreStatus, Engine, EngineConstructor, QueueItem, WorldsRegistry } from "@pixelaw/core"
import { PixelawCore } from "@pixelaw/core"
import type { DojoEngine } from "@pixelaw/core-dojo"
import type { Storage, StorageValue } from "unstorage"

export class PixelawAgent {
    private core: PixelawCore

    public static async new(
        engines: Record<string, EngineConstructor<Engine>>,
        worldsRegistry: WorldsRegistry,
        storage: Storage<StorageValue>,
    ): Promise<PixelawAgent> {
        const agent = new PixelawAgent(engines, worldsRegistry, storage)
        await agent.initialize()
        return agent
    }

    constructor(
        engines: Record<string, EngineConstructor<Engine>>,
        worldsRegistry: WorldsRegistry,
        storage: Storage<StorageValue>,
    ) {
        this.core = new PixelawCore(engines, worldsRegistry, storage)
    }

    private async initialize() {
        const handleStatusChange = (newStatus: CoreStatus) => {
            console.log("Status changed:", newStatus)
        }

        const handleEngineChange = (newEngine: Engine | null) => {
            console.log("Engine changed:", newEngine?.constructor.name)
        }

        this.core.events.on("statusChanged", handleStatusChange)
        this.core.events.on("engineChanged", handleEngineChange)

        try {
            const handleQueueItem = (item: QueueItem) => {
                this.core
                    .executeQueueItem(item)
                    .then((ret) => {
                        console.log("handleQueueItem done", ret)
                    })
                    .catch(console.error)
            }

            await this.core.loadWorld("local")

            const dojoEngine: DojoEngine = this.core.engine as DojoEngine

            // FIXME
            this.core.setWallet(await dojoEngine.getPreDeployedWallet(process.env.WALLET_PK))

            this.core.queue.eventEmitter.on("scheduled", handleQueueItem)

            console.log("done loading")
        } catch (error) {
            console.error("Failed to load world:", error)
        }
    }
}
