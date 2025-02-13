import { PixelawCore } from "@pixelaw/core"
import type { App, CoreStatus, Engine } from "@pixelaw/core"

import type { Coordinate, EngineConstructor, WorldsRegistry } from "@pixelaw/core/src"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

export type IPixelawContext = {
    pixelawCore: PixelawCore
    coreStatus: CoreStatus
    app: string | null
    engine: Engine | null
    world: string
    color: number
    center: Coordinate
    zoom: number
    setApp: (app: string) => void
    setWorld: (world: string) => void
    setColor: (color: number) => void
    setCenter: (center: Coordinate) => void
    setZoom: (zoom: number) => void
}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined)

export const PixelawProvider = ({
                                    children,
                                    worldsRegistry,
                                    world,
                                    engines,
                                    coreDefaults,
                                }: { children: ReactNode; worldsRegistry: WorldsRegistry; world: string, engines: EngineConstructor<Engine>[] ,coreDefaults?: CoreDefaults}) => {

    const [pixelawCore] = useState(() => new PixelawCore(engines, worldsRegistry))

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        pixelawCore,
        coreStatus: "uninitialized",
        app: pixelawCore.getApp(),
        engine: null,
        world: pixelawCore.getWorld(),
        color: pixelawCore.getColor(),
        center: pixelawCore.getCenter(),
        zoom: pixelawCore.getZoom(),
        setApp: (app: App) => {
            pixelawCore.setApp(app)
        },
        setWorld: (world: string) => {
            pixelawCore.loadWorld(world)
        },
        setColor: (color: number) => {
            pixelawCore.setColor(color)
        },
        setCenter: (center: Coordinate) => {
            pixelawCore.setCenter(center)
        },
        setZoom: (zoom: number) => {
            pixelawCore.setZoom(zoom)
        },
    })

    useEffect(() => {
        const handlers = {
            statusChanged: (newStatus: CoreStatus) => setContextValues(prev => ({ ...prev, coreStatus: newStatus })),
            appChanged: (newApp: App | null) => setContextValues(prev => ({ ...prev, app: newApp })),
            engineChanged: (newEngine: Engine | null) => setContextValues(prev => ({ ...prev, engine: newEngine })),
            worldChanged: (newWorld: string) => setContextValues(prev => ({ ...prev, world: newWorld })),
            colorChanged: (newColor: number) => setContextValues(prev => ({ ...prev, color: newColor })),
            centerChanged: (newCenter: Coordinate) => setContextValues(prev => ({ ...prev, center: newCenter })),
            zoomChanged: (newZoom: number) => setContextValues(prev => ({ ...prev, zoom: newZoom })),
        }

        if (pixelawCore) {
            console.log("loading provider")

            pixelawCore.loadWorld(world, coreDefaults).catch((error) => {
                console.error("Failed to load world:", error)
                setContextValues((prev) => ({
                    ...prev,
                    clientState: "error",
                    clientError: error,
                }))
            })
        }

        for (const [event, handler] of Object.entries(handlers)) {
            pixelawCore.events.on(event, handler)
        }

        return () => {
            for (const [event, handler] of Object.entries(handlers)) {
                pixelawCore.events.off(event, handler)
            }
        }
    }, [pixelawCore, world])

    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("usePixelawProvider can only be used within a PixelawProvider")
    return context
}
