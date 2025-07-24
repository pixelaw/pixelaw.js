import Ably, { type RealtimeChannel } from "ably";
import type { PixelawCore } from "src/PixelawCore.ts";
import type { Bounds, UpdateService } from "../types.ts";

export class AblyUpdateService implements UpdateService {
  private _ably: Ably.Realtime;
  private _channel: RealtimeChannel;
  private _core: PixelawCore;
  //
  constructor(core: PixelawCore) {
    this._core = core;
    this._ably = new Ably.Realtime(
      "5H4sWg.qL6dfg:D1nIhqTdqDQ7wgXW5mXQ5TbGilfGgDicYEjLPNTQmrI",
    );

    this._ably.connection.once("connected", () => {
      console.log("Connected to Ably!");
    });

    this._channel = this._ably.channels.get(core.world);

    this._channel
      .subscribe("PixelUpdate", (message) => {
        console.log("PixelUpdate received: " + message.data);
        const pixels = JSON.parse(message.data);
        this._core.pixelStore.setPixels(pixels);
      })
      .then();
  }

  get channel() {
    return this._channel;
  }

  public setBounds(_b: Bounds): void {}
}
