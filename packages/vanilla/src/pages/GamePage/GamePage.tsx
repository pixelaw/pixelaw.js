import Apps from "@/components/GamePage/Apps/Apps.tsx"
import SimpleColorPicker from "@/components/GamePage/ColorPicker/SimpleColorPicker.tsx"
import { DEFAULT_WORLD } from "@/global/constants.ts"
import { clearDomChildren, hexRGBtoNumber } from "@/global/utils.ts"
import useSettingStore from "@/hooks/SettingStore.ts"
import { type Coordinate, MAX_DIMENSION } from "@pixelaw/core"
import { usePixelawProvider } from "@pixelaw/react"
import { useEffect, useMemo, useRef } from "react"
import { useLocation } from "react-router-dom"
import { create } from "zustand/index"
import styles from "./GamePage.module.css"
import dialogStyles from "./dialog.css"

const ZOOM_PRESETS = { tile: 100, pixel: 7000 }
const DEFAULT_ZOOM = ZOOM_PRESETS.pixel
const DEFAULT_CENTER: Coordinate = [MAX_DIMENSION - 100, MAX_DIMENSION - 100]

interface ViewState {
    selectedApp: string
    center: Coordinate
    zoom: number
    color: string
    world: string
    hoveredCell?: Coordinate
    clickedCell?: Coordinate
    setSelectedApp: (appName: string) => void
    setCenter: (center: Coordinate) => void
    setZoom: (zoom: number) => void
    setColor: (color: string) => void
    setHoveredCell: (cell?: Coordinate) => void
    setClickedCell: (cell?: Coordinate) => void
}

const useViewState = create<ViewState>((set) => ({
    selectedApp: "",
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    color: "000000",
    world: DEFAULT_WORLD,
    hoveredCell: undefined,
    clickedCell: undefined,
    setSelectedApp: (appName: string) => set({ selectedApp: appName }),
    setCenter: (center: Coordinate) => set({ center }),
    setZoom: (zoom: number) => set({ zoom }),
    setColor: (color: string) => set({ color: color }),
    setWorld: (world: string) => set({ world: world }),
    setHoveredCell: (cell?: Coordinate) => set({ hoveredCell: cell }),
    setClickedCell: (cell?: Coordinate) => set({ clickedCell: cell }),
}))

const GamePage: React.FC = () => {
    const { pixelawCore, coreStatus } = usePixelawProvider()
    const { viewPort: renderer } = pixelawCore
    const rendererContainerRef = useRef<HTMLDivElement | null>(null)
    const dialogContainerRef = useRef<HTMLDivElement | null>(null)

    // v TODO move below to Core
    const location = useLocation()
    const {
        selectedApp,
        setSelectedApp,
        center,
        setCenter,
        zoom,
        setZoom,
        color,
        setColor,
        hoveredCell,
        setHoveredCell,
        clickedCell,
        setClickedCell,
    } = useViewState()
    const { setWorld, world } = useSettingStore()
    const initialLoad = useRef(true)

    const zoombasedAdjustment = useMemo(() => {
        return zoom > 3000 ? "1rem" : "-100%"
    }, [zoom])

    // Initial load
    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false
            const queryParams = new URLSearchParams(location.search)
            const appInQuery = queryParams.get("app")
            const centerInQuery = queryParams.get("center")?.split(",").map(Number) as Coordinate
            const zoomInQuery = Number(queryParams.get("zoom"))
            const colorInQuery = queryParams.get("color")
            const worldInQuery = queryParams.get("world")

            if (appInQuery && appInQuery.length > 0) setSelectedApp(appInQuery)
            if (centerInQuery) setCenter(centerInQuery)
            if (zoomInQuery) setZoom(zoomInQuery)
            if (colorInQuery) setColor(colorInQuery)
            if (worldInQuery) setWorld(worldInQuery)
        }
    }, [setSelectedApp, setCenter, setZoom, setColor, location.search, setWorld])

    // Updating the URL
    useEffect(() => {
        const updateURL = () => {
            const queryParams = new URLSearchParams()
            queryParams.set("app", selectedApp)
            queryParams.set("center", `${center[0]},${center[1]}`)
            queryParams.set("zoom", zoom.toString())
            queryParams.set("color", color)
            queryParams.set("world", world)
            const newSearch = `?${queryParams.toString()}`

            if (window.location.search !== newSearch) {
                window.history.replaceState(null, "", newSearch)
            }
        }
        updateURL()

        pixelawCore.setColor(hexRGBtoNumber(color))
    }, [selectedApp, center, zoom, color, world])

    // ^ TODO move Above to Core

    // Handle viewport events
    useEffect(() => {
        const handleZoomChange = (newZoom: number) => {
            setZoom(newZoom)
        }
        const handleCenterChange = (newCenter: Coordinate) => {
            setCenter(newCenter)
        }
        const handleCellHover = (cell?: Coordinate) => {
            setHoveredCell(cell)
        }
        const handleCellClick = (cell?: Coordinate) => {
            if (!dialogContainerRef || !dialogContainerRef.current) return

            setClickedCell(cell)
            const interaction = pixelawCore.handleInteraction(cell)

            // Clear existing children (dialogs)
            clearDomChildren(dialogContainerRef.current)

            // It is possible the interaction has no dialog, like with "paint"
            // In this case, the onchain action is immediately performed
            if (interaction.dialog) {
                // Append the new dialog
                dialogContainerRef.current.appendChild(interaction.dialog)

                interaction.dialog.showModal()
            }
        }

        pixelawCore.events.on("zoomChanged", handleZoomChange)
        pixelawCore.events.on("centerChanged", handleCenterChange)
        pixelawCore.events.on("cellHovered", handleCellHover)
        pixelawCore.events.on("cellClicked", handleCellClick)

        return () => {
            pixelawCore.events.off("zoomChanged", handleZoomChange)
            pixelawCore.events.off("centerChanged", handleCenterChange)
            pixelawCore.events.off("cellHovered", handleCellHover)
            pixelawCore.events.off("cellClicked", handleCellClick)
        }
    }, [pixelawCore, setZoom, setCenter, setHoveredCell, setClickedCell])

    useEffect(() => {
        if (coreStatus !== "ready") return

        renderer.setContainer(rendererContainerRef.current!)
        renderer.setCenter(center)
    }, [coreStatus, renderer])

    return (
        <>
            <div ref={rendererContainerRef} style={{ width: "100%", height: "100%" }} />

            <div className={styles.colorpicker} style={{ bottom: zoombasedAdjustment }}>
                <SimpleColorPicker color={color} onColorSelect={setColor} />
            </div>

            <div className={styles.apps} style={{ left: zoombasedAdjustment }}>
                <Apps
                    appStore={pixelawCore.appStore}
                    selectedApp={selectedApp}
                    setSelectedApp={setSelectedApp}
                    hoveredCell={hoveredCell}
                />
            </div>
            <div ref={dialogContainerRef}>
                <dialog>
                    <p>Dialog content goes here.</p>
                </dialog>
            </div>
        </>
    )

    //</editor-fold>
}

export default GamePage
