import { PixelawCore, type CoreStatus, type App } from "pixelaw-web"
import worldsConfig from "@/config/worlds.json"

// import useSettingStore from "@/hooks/SettingStore.ts"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"
import {DEFAULT_WORLD} from "@/global/constants.ts";

export type IPixelawContext = {
    // world: string
    // worldConfig: WorldConfig
    // walletType: "" | "argent" | "braavos" | "burner" | "controller" | undefined

    pixelawCore: PixelawCore
    coreStatus: CoreStatus
    app: typeof App | null
    setApp: (app: App) => void
}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined)


export const PixelawProvider = ({ children }: { children: ReactNode }) => {
    // const { setWallet, setWorld, worldConfig, world } = useSettingStore()
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
        const worldConfig = worldsConfig[DEFAULT_WORLD]

        if (worldConfig && pixelawCore) {
            console.log("loading provider")

            pixelawCore.loadWorld(worldConfig).catch((error) => {
                console.error("Failed to load world:", error)
                setContextValues((prev) => ({
                    ...prev,
                    clientState: "error",
                    clientError: error,
                }))
            })
        }
        const logger = (type, e) => console.log(type, e)

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

export const
     usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("usePixelawProvider can only be used within a PixelawProvider")
    return context
}
