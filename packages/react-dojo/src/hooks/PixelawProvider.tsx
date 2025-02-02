import { type App, type CoreStatus, PixelawCore, type WorldConfig } from "@pixelaw/core"
import { DojoEngine } from "@pixelaw/core-dojo"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"


export type IPixelawContext = {
    pixelawCore: PixelawCore
    coreStatus: CoreStatus
    app: App | null
    setApp: (app: App) => void
}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined)


export const PixelawProvider = ({ children, worldConfig }: { children: ReactNode, worldConfig: WorldConfig }) => {

    const [pixelawCore] = useState(() => new PixelawCore()) // Initialize PixelawCore

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        pixelawCore,
        coreStatus: "uninitialized",
        app: null,
        setApp: (app: App) => {pixelawCore.setApp(app)}
    })

    // Loading
    useEffect(() => {
        const handleStatusChange = (newStatus: CoreStatus) => {
            setContextValues((prev) => ({
                ...prev,
                coreStatus: newStatus,
            }))
        }
        const handleAppChange = (newApp: App | null) => {
            setContextValues((prev) => ({
                ...prev,
                app: newApp,
            }))
        }

        if (worldConfig && pixelawCore) {
            console.log("loading provider")

            pixelawCore.registerEngine(DojoEngine)
            pixelawCore.loadWorld(worldConfig).catch((error) => {
                console.error("Failed to load world:", error)
                setContextValues((prev) => ({
                    ...prev,
                    clientState: "error",
                    clientError: error,
                }))
            })
        }
        const logger = (type: any, e: any) => console.log(type, e)

        // pixelawCore.events.on("*", logger)
        pixelawCore.events.on("statusChange", handleStatusChange)
        pixelawCore.events.on("appChange", handleAppChange)
        return () => {
            pixelawCore.events.off("statusChange", handleStatusChange)
            pixelawCore.events.off("appChange", handleAppChange)
            pixelawCore.events.off("*", logger)
        }
    }, [ pixelawCore])

    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("usePixelawProvider can only be used within a PixelawProvider")
    return context
}
