import { PixelawCore } from "@pixelaw/core";
import type { CoreStatus, Engine, EngineConstructor, WorldsRegistry } from "@pixelaw/core";
import mitt from "mitt";


export class PixelawAgent {
    private core: PixelawCore;

    public static async new( engines: EngineConstructor<Engine>[], worldsRegistry: WorldsRegistry): Promise<PixelawCore> {
        const agent = new PixelawAgent(engines, worldsRegistry);
        await agent.initialize();
        return agent;
    }

    private constructor(engines: EngineConstructor<Engine>[],worldsRegistry: WorldsRegistry) {
        this.core = new PixelawCore(engines, worldsRegistry);

    }

    private async initialize( ) {
        const handleStatusChange = (newStatus: CoreStatus) => {
            console.log("Status changed:", newStatus);
        };

        const handleEngineChange = (newEngine: Engine | null) => {
            console.log("Engine changed:", newEngine?.constructor.name);
        };

        this.core.events.on("statusChange", handleStatusChange);
        this.core.events.on("engineChanged", handleEngineChange);

        try {
            await this.core.loadWorld("local");
        } catch (error) {
            console.error("Failed to load world:", error);
        }
    }
}
