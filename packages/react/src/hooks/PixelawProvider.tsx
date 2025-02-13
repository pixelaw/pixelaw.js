import { PixelawCore } from "@pixelaw/core"
import type { App, CoreStatus, Engine } from "@pixelaw/core"

import type {EngineConstructor, WorldsRegistry} from "@pixelaw/core/src"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

export type IPixelawContext = {
    pixelawCore: PixelawCore
    coreStatus: CoreStatus
    app: App | null
    engine: Engine | null
    world: string
    setApp: (app: App) => void
    setWorld: (world:string) => void
}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined)

export const PixelawProvider = ({
    children,
    worldsRegistry,
    world,
    engines,
}: { children: ReactNode; worldsRegistry: WorldsRegistry; world: string, engines: EngineConstructor<Engine>[] }) => {

    const [pixelawCore] = useState(() => new PixelawCore(engines, worldsRegistry)) // Initialize PixelawCore instance

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        pixelawCore,
        coreStatus: "uninitialized",
        app: null,
        engine: null,
        world: world,
        setApp: (app: App) => {
            pixelawCore.setApp(app)
        },
        setWorld: (world:string) => {
            pixelawCore.loadWorld(world)
        },
    })

    // Loading
    useEffect(() => {
        const handlers = {
            statusChanged: (newStatus: CoreStatus) => setContextValues(prev => ({ ...prev, coreStatus: newStatus })),
            appChanged: (newApp: App | null) => setContextValues(prev => ({ ...prev, app: newApp })),
            engineChanged: (newEngine: Engine | null) => setContextValues(prev => ({ ...prev, engine: newEngine })),
            worldChanged: (newWorld: string) => setContextValues(prev => ({ ...prev, world:newWorld })),
        }



        if (pixelawCore) {
            console.log("loading provider")

            pixelawCore.loadWorld(world).catch((error) => {
                console.error("Failed to load world:", error)
                setContextValues((prev) => ({
                    ...prev,
                    clientState: "error",
                    clientError: error,
                }))
            })
        }

        const logger = (type: any, e: any) => console.log(type, e)

        for (const [event, handler] of Object.entries(handlers)) {
            pixelawCore.events.on(event, handler)
        }

        return () => {
            for (const [event, handler] of Object.entries(handlers)) {
                pixelawCore.events.off(event, handler)
            }
            pixelawCore.events.off("*", logger)
        }
    }, [pixelawCore, world])

    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("usePixelawProvider can only be used within a PixelawProvider")
    return context
}
