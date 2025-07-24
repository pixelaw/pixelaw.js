import type {
  App,
  Engine,
  EngineStatus,
  Engines,
  Interaction,
  Pixel,
  PixelawCore,
  QueueItem,
  InteractParams,
  Coordinate,
} from "@pixelaw/core";

export type MudConfig = {
  todo: number;
};

const ENGINE_ID = "mud";

export class MudEngine implements Engine {
  id: Engines = ENGINE_ID;
  status: EngineStatus = "uninitialized";
  config: MudConfig = null!;
  core: PixelawCore;

  constructor(core: PixelawCore) {
    this.core = core;
  }
  async init(config: MudConfig) {
    console.log("MudEngine init", config, this.constructor.name);
  }

  async prepInteraction(_coordinate: Coordinate): Promise<Interaction> {
    return {} as unknown as Interaction;
  }

  async executeInteraction(_interaction: Interaction): Promise<void> {
    console.log("TODO executeInteraction");
  }

  executeQueueItem(_queueItem: QueueItem): Promise<boolean> {
    return Promise.resolve(false);
  }
}
