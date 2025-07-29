import type mitt from "mitt";
import type { PixelawCore } from "./PixelawCore.ts";

export type Pixel = {
	x: number;
	y: number;
	action: string;
	app: string;
	color: number | string;
	owner: string;
	text: string;
	timestamp: number | string;
};

export type App = {
	system: string;
	name: string;
	icon: string;
	action: string;
	plugin: string;
	entity: {
		id: string;
	};
};

export type Variant = {
	name: string;
	value: number;
};

export type InteractParams = InteractParam[];

export type InteractParam = {
	name: string;
	type: "string" | "number" | "enum" | "emoji";
	typeName: string | null;
	variants: Variant[];
	transformer: () => Promise<void>;
	value?: number | string | null;
	systemOnly?: boolean;
};

export type Tile = HTMLImageElement;

export interface UpdateService {
	// tileChanged: TileChangedMessage | null
	setBounds: (newBounds: Bounds) => void;
}

export interface AppStore {
	getByName: (name: string) => App | undefined;
	getBySystem: (system: string) => App | undefined;
	getAll: () => App[];
}

// TODO this is rough and maybe dojo centric
export type QueueItem = {
	id: string;
	timestamp: number;
	called_system: string;
	selector: string;
	calldata: string;
};

export type Notification = {
	position: Position;
	app: App;
	color: number;
	from: string | null;
	to: string | null;
	text: string;
};

export type NotificationStoreEvents = {
	updated: number;
	added: Notification;
};

export type QueueStoreEvents = {
	updated: number;
	scheduled: QueueItem;
};

export interface QueueStore {
	eventEmitter: ReturnType<typeof mitt<QueueStoreEvents>>;
	getAll: () => QueueItem[];
	retrieve: () => Promise<void>;
}

export interface NotificationStore {
	eventEmitter: ReturnType<typeof mitt<NotificationStoreEvents>>;
	getAll: () => Notification[];
	// getLastForPosition: (position: Position) => Notification[]
}

export interface TileStore {
	refresh: () => void;
	prepare: (bounds: Bounds) => void;
	// fetchTile: (key: string) => void
	// getTile: (key: string) => Tile | undefined | "";
	// setTile: (key: string, tile: Tile) => Promise<void>;
	setTiles: (tiles: { key: string; tile: Tile }[]) => Promise<void>;
	tileset: Tileset | null;
	cacheUpdated: number;
}

export interface Interaction {
	// action: (params: InteractParams) => void
	getUserParams: () => InteractParams;
	setUserParam: (name: string, value: unknown) => void;
	execute: () => Promise<void>;
}

export interface Tileset {
	tileSize: number;
	scaleFactor: number;
	bounds: Bounds;
	tileRows: (Tile | undefined | "")[][];
}

export interface Executor {
	account: unknown;
	enqueue(
		call: unknown,
		onSuccess: (result: unknown) => void,
		onFail: (error: unknown) => void,
	): void;
	get pendingCalls(): number;
	set wallet(wallet: Wallet);
}

// Used for SmartContracts
export type Position = {
	x: number;
	y: number;
};

export type RGB = [number, number, number];

export type Coordinate = [number, number];

export type Bounds = [topLeft: Coordinate, bottomRight: Coordinate];

export const MAX_DIMENSION: number = 32_767; // 2**15 -1

// Don't query everytime bounds change, but only when the buffer resolution changes
// So when bounds change from 5 to 6, but Buffer is 10, no requery happens
export const QUERY_BUFFER: number = 20;

export const TILESIZE = 100;

// TODO handle scalefactor 10 later
export const DEFAULT_SCALEFACTOR = 1;

export function makeString<Coordinate>(coordinate: Coordinate): string {
	if (!Array.isArray(coordinate) || coordinate.length !== 2) {
		throw new Error("Invalid coordinate");
	}
	return `${coordinate[0]}_${coordinate[1]}`;
}

export type SimplePixelError = { coordinate: Coordinate | null; error: string };

export type PixelCoreEvents = {
	cellClicked: Coordinate;
	cellHovered: Coordinate | undefined;
	accountChanged: unknown | null; // TODO should have a type for Account?
	centerChanged: Coordinate;
	boundsChanged: Bounds;
	engineChanged: Engine;
	statusChanged: CoreStatus;
	walletChanged: Wallet;
	pixelStoreUpdated: number;
	tileStoreUpdated: number;
	appStoreUpdated: number;
	error: SimplePixelError;
	notification: Notification;
	userScrolled: { bounds: Bounds };
	userZoomed: { bounds: Bounds };
	cacheUpdated: number;
	appChanged: string | null;
	worldChanged: string | null;
	colorChanged: number;
	zoomChanged: number;
};

export type EngineStatus = "ready" | "loading" | "error" | "uninitialized";
export type CoreStatus =
	| "uninitialized"
	| "loadConfig"
	| "initEngine"
	| "initWallet"
	| "initAccount"
	| "ready"
	| "readyWithoutWallet"
	| "error";

export interface Engine {
	id: Engines;
	core: PixelawCore;
	status: EngineStatus;

	init(engineConfig: unknown): Promise<void>;
	// setAccount(account: unknown): void
	// handleInteraction(app: App, pixel: Pixel, color: number): Promise<Interaction | undefined>
	prepInteraction(coordinate: Coordinate): Promise<Interaction>;
	// executeInteraction(interaction: Interaction): Promise<void>
	executeQueueItem(queueItem: QueueItem): Promise<boolean>;
}

export type EngineConstructor<T extends Engine> = new (core: PixelawCore) => T;

export interface WalletConfig {
	masterAddress?: string;
	masterPrivateKey?: string;
	accountClassHash?: string;
	rpcUrl?: string;
	profileUrl?: string;
	url?: string;
}

export type WorldsRegistry = Record<string, WorldConfig>;

export type Engines = "dojo" | "mud";

export type WorldConfig = {
	engine: Engines;
	description: string;
	defaults?: CoreDefaults;
	config: unknown;
};

export type CoreDefaults = {
	app: string;
	color: number;
	center: number[]; // same as Coordinate
	zoom: number;
};

export type PixelStoreEvents = {
	cacheUpdated: number;
};

export interface PixelStore {
	eventEmitter: ReturnType<typeof mitt<PixelStoreEvents>>;
	refresh: () => void;
	prepare: (bounds: Bounds) => void;
	getPixel: (coordinate: Coordinate) => Pixel | undefined;
	setPixelColor: (coord: Coordinate, color: number) => void;
	setPixel: (key: string, pixel: Pixel) => void;
	setPixels: (pixels: Pixel[]) => void;
	unload?: () => Promise<void>;
}

export class BaseWallet {
	engine: string;
	id: unknown;
	address: string;
	chainId: string;

	constructor(engine: string, id: string, address: string, chainId: string) {
		this.engine = engine;
		this.id = id;
		this.address = address;
		this.chainId = chainId;
	}
}

export abstract class Wallet extends BaseWallet {
	abstract toJSON(): unknown;
	abstract get isConnected(): boolean;
	abstract get account(): unknown;
}
export const IS_BROWSER =
	typeof window !== "undefined" && typeof window.document !== "undefined";
