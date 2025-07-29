import type { PixelawCore } from "../../PixelawCore.ts";
import type { Bounds, Coordinate, Notification } from "../../types";
import { areBoundsEqual, areCoordinatesEqual } from "../../utils.ts";
import { EffectsManager } from "./effects";
import { EventHandlers } from "./handlers";
import { RenderingMethods } from "./rendering";
import {
	type Canvas2DRendererOptions,
	DEFAULT_OPTIONS,
	type GlowingCell,
	isBrowser,
} from "./types";

/**
 * Manages the rendering of a grid of cells on a canvas
 */
export default class Canvas2DRenderer {
	// Public access to canvas and context for handlers
	public canvas: HTMLCanvasElement;
	public ctx: CanvasRenderingContext2D;
	public core: PixelawCore;
	public options: Canvas2DRendererOptions;

	// Viewport state
	public zoom: number;
	public center: Coordinate = [0, 0];
	public bounds: Bounds = [
		[0, 0],
		[0, 0],
	];

	// Public properties for handlers
	public offsetX = 0;
	public offsetY = 0;
	public dragStartTime = 0;
	public lastDragTime = 0;

	public dragStartCoord: Coordinate | null = null;
	public lastDragPoint: Coordinate = [0, 0];
	public initialPinchDistance: number | null = null;
	public initialPinchZoom: number;

	// For panning "inertia"
	public panInertiaVelocity: [number, number] = [0, 0];
	public isPanInertiaActive = false;

	// For zooming "inertia"
	public zoomInertiaVelocity: number;
	public isZoomInertiaActive = false;

	// Glow
	public glowingCells: Map<string, GlowingCell> = new Map();
	public glowInterval: NodeJS.Timeout | null = null;

	// Notification
	public activeNotifications: Map<string, Notification> = new Map();

	public readonly decelerationFactor = 0.9; // Adjust for desired deceleration

	// Component instances
	private handlers: EventHandlers;
	private rendering: RenderingMethods;
	effects: EffectsManager;

	// render management
	public needRender = true;

	constructor(
		core: PixelawCore,
		options: Partial<Canvas2DRendererOptions> = {},
	) {
		// Create a new canvas element
		this.canvas = document.createElement("canvas");
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.canvas.style.display = "block";
		this.canvas.style.cursor = "grab";

		// Get canvas context
		const ctx = this.canvas.getContext("2d");
		if (!ctx) {
			throw new Error("Failed to get canvas 2D context");
		}
		this.ctx = ctx;

		// Initialize properties
		this.core = core;
		this.options = { ...DEFAULT_OPTIONS, ...options };
		this.zoom = core.zoom;

		// Initialize component instances
		this.handlers = new EventHandlers(this);
		this.rendering = new RenderingMethods(this);
		this.effects = new EffectsManager(this);

		// Initialize event listeners
		this.handlers.initEventListeners();

		// Set initial canvas size when it's attached to the DOM
		const resizeObserver = new ResizeObserver(() => {
			this.resizeCanvas();
		});
		resizeObserver.observe(this.canvas);

		this.subscribeToEvents();

		this.setCenter(core.center);

		this.startRenderLoop();
	}

	private subscribeToEvents() {
		if (!this.core.pixelStore) throw new Error("PixelStore not initialized");
		// TODO decide on whether pixelstore cacheupdated goes to a global event bus or not
		this.core.pixelStore.eventEmitter.on(
			"cacheUpdated",
			(_timestamp: number) => {
				console.log("cacheUpdated");
				this.needRender = true;
				// this.requestRender()
			},
		);

		this.core.events.on("pixelStoreUpdated", (timestamp: number) => {
			console.log(`pixelStoreUpdated at: ${timestamp}`);
			// this.requestRender()
			this.needRender = true;
		});
		this.core.events.on("tileStoreUpdated", (timestamp: number) => {
			console.log(`tileStoreUpdated at: ${timestamp}`);
			// this.requestRender()
			this.needRender = true;
		});
	}

	public startRenderLoop() {
		const renderLoop = () => {
			if (this.needRender) {
				this.needRender = false;
				this.requestRender();
			}
			requestAnimationFrame(renderLoop);
		};
		requestAnimationFrame(renderLoop);
	}

	public requestRender() {
		if (isBrowser) {
			requestAnimationFrame(() => {
				this.rendering.render();
			});
		} else {
			setImmediate(() => {
				this.rendering.render();
			});
		}
	}

	public setContainer(container: HTMLElement) {
		this.canvas.width = container.clientWidth;
		this.canvas.height = container.clientHeight;
		container.appendChild(this.canvas);
	}

	/**
	 * Resizes the canvas to fill its container
	 */
	private resizeCanvas(): void {
		const container = this.canvas.parentElement;

		if (container) {
			this.canvas.width = container.clientWidth;
			this.canvas.height = container.clientHeight;
			// this.requestRender()
			this.needRender = true;

			this.updateBounds();
			this.setCenter(this.center);
		}
	}

	/**
	 * Starts a glow effect on a specific cell by delegating to the effects manager
	 */
	public addGlow(
		coordinate: Coordinate,
		duration: number,
		htmlColor: string,
		intensity: number,
		size: number,
	): void {
		this.effects.addGlow(coordinate, duration, htmlColor, intensity, size);
	}

	/**
	 * Starts a glow effect on a specific cell by delegating to the effects manager
	 */
	public addNotification(
		coordinate: Coordinate,
		duration: number,
		message: string,
	): void {
		this.effects.addNotification(coordinate, duration, message);
	}

	/**
	 * Converts screen coordinates to grid coordinate as a Coordinate type
	 */
	private screenToGridCoordinate(screenX: number, screenY: number): Coordinate {
		const gridX = Math.floor(
			(screenX - this.offsetX) / (this.zoom * this.options.cellSize),
		);
		const gridY = Math.floor(
			(screenY - this.offsetY) / (this.zoom * this.options.cellSize),
		);
		return [gridX, gridY];
	}

	/**
	 * Gets the current zoom level
	 */
	public getZoom(): number {
		return this.zoom;
	}

	/**
	 * Gets the current visible bounds
	 */
	public getBounds(): Bounds {
		const topLeft = this.screenToGridCoordinate(0, 0);
		const bottomRight = this.screenToGridCoordinate(
			this.canvas.width,
			this.canvas.height,
		);
		return [topLeft, bottomRight];
	}

	/**
	 * Sets the zoom level
	 */
	public setZoom(zoom: number): void {
		if (this.zoom !== zoom) {
			// Set zoom level first
			this.zoom = Math.max(
				this.options.minZoom,
				Math.min(this.options.maxZoom, zoom),
			);

			this.core.events.emit("zoomChanged", this.zoom);
		}
	}

	/**
	 * Gets the center position in grid coordinates
	 */
	public getCenter(): Coordinate {
		const centerX = Math.floor(
			(this.canvas.width / 2 - this.offsetX) /
				(this.zoom * this.options.cellSize),
		);
		const centerY = Math.floor(
			(this.canvas.height / 2 - this.offsetY) /
				(this.zoom * this.options.cellSize),
		);
		return [centerX, centerY];
	}

	/**
	 * Centers the viewport on the specified coordinate
	 */
	public setCenter(newCenter: Coordinate): void {
		if (this.getCenter() !== newCenter) {
			// Then calculate the offset needed to center on the specified coordinates
			this.offsetX =
				this.canvas.width / 2 -
				newCenter[0] * this.options.cellSize * this.zoom;
			this.offsetY =
				this.canvas.height / 2 -
				newCenter[1] * this.options.cellSize * this.zoom;

			this.updateCenter();
			this.updateBounds();
		}
	}

	// Update this.center and emit event, if applicable
	public updateCenter(): void {
		const currentCenter = this.center;
		const newCenter = this.getCenter();
		if (!areCoordinatesEqual(currentCenter, newCenter)) {
			this.center = newCenter;
			this.core.events.emit("centerChanged", newCenter);
		}
	}

	public updateZoom(newZoom: number): void {
		const currentZoom = this.zoom;
		if (currentZoom !== newZoom) {
			this.zoom = newZoom;
			this.core.events.emit("zoomChanged", newZoom);
		}
	}

	public updateBounds(): void {
		const currentBounds = this.bounds;
		const newBounds = this.getBounds();
		if (!areBoundsEqual(currentBounds, newBounds)) {
			this.bounds = newBounds;
			this.core.events.emit("boundsChanged", newBounds);
		}
	}
}
