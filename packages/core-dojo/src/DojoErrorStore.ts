import type {
	Coordinate,
	ErrorStore,
	ErrorStoreEvents,
	PixelawCore,
	SimplePixelError,
} from "@pixelaw/core";
import mitt from "mitt";

type State = SimplePixelError[];

export class DojoErrorStore implements ErrorStore {
	public readonly eventEmitter = mitt<ErrorStoreEvents>();
	private static instance: DojoErrorStore;
	private state: State = [];
	private core: PixelawCore;

	protected constructor(core: PixelawCore) {
		this.core = core;
	}

	// Singleton factory
	public static async getInstance(core: PixelawCore): Promise<DojoErrorStore> {
		if (!DojoErrorStore.instance) {
			DojoErrorStore.instance = new DojoErrorStore(core);
		}
		return DojoErrorStore.instance;
	}

	public addError(error: SimplePixelError): void {
		// Ensure error has timestamp
		const timestampedError: SimplePixelError = {
			...error,
			timestamp: error.timestamp || Date.now(),
		};

		this.state.push(timestampedError);

		// Keep only last 100 errors to prevent memory leaks
		if (this.state.length > 100) {
			this.state = this.state.slice(-100);
		}

		this.eventEmitter.emit("errorAdded", timestampedError);
	}

	public getErrors(): SimplePixelError[] {
		const lastEventAck = this.core.lastEventAck;
		return this.state.filter((error) => error.timestamp > lastEventAck);
	}

	public getErrorsForCoordinate(coord: Coordinate): SimplePixelError[] {
		return this.state.filter(
			(error) =>
				error.coordinate &&
				error.coordinate[0] === coord[0] &&
				error.coordinate[1] === coord[1],
		);
	}

	public clearErrors(): void {
		this.state = [];
		this.eventEmitter.emit("errorsCleared", undefined);
	}
}
