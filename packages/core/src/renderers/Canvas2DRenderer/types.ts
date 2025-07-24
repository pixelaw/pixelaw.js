import type { Bounds, Coordinate, Pixel, RGB } from "../../types";
import type { PixelawCore } from "../../PixelawCore.ts";
export * from "./index.ts";

export { getZoomLevel } from "./utils.ts";

export const ZOOM_MAX = 30;
export const ZOOM_CLOSE_MAX = 22;
export const ZOOM_MID_MAX = 4;
export const ZOOM_FAR_MAX = 0.25;
export const ZOOM_DEFAULT = 0.25;

export type ZOOM_LEVEL = "far" | "mid" | "close";

export interface GlowingCell {
  intensity: number;
  duration: number;
  startTime: number;
  color: RGB;
  size: number;
}

interface Notification {
  startTime: number;
  duration: number;
  message: string;
}

/**
 * Configuration options for the grid renderer
 */
export interface Canvas2DRendererOptions {
  cellSize: number;
  defaultZoom: number;
  minZoom: number;
  maxZoom: number;
  backgroundColor: string;
  gridLineColor: string;
  showGridLines: boolean;
}

/**
 * Default configuration for the grid renderer
 */
export const DEFAULT_OPTIONS: Canvas2DRendererOptions = {
  cellSize: 10,
  defaultZoom: ZOOM_DEFAULT,
  minZoom: ZOOM_FAR_MAX,
  maxZoom: ZOOM_MAX,
  backgroundColor: "#000000",
  gridLineColor: "#444444",
  showGridLines: true,
};

export const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";
