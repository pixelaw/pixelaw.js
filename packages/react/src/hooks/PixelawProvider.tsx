import type {
    Coordinate,
    CoreDefaults,
    CoreStatus,
    Engine,
    EngineConstructor,
    Wallet,
    WorldsRegistry,
} from "@pixelaw/core"
import {type BaseWallet, PixelawCore} from "@pixelaw/core"
import {createContext, type ReactNode, useContext, useEffect, useState} from "react"

import {createStorage} from "unstorage"
import localStorageDriver from "unstorage/drivers/localstorage"
import {ChainProvider} from "./ChainProvider"

export type IPixelawContext = {
    pixelawCore: PixelawCore
    coreStatus: CoreStatus
    wallet: BaseWallet | Wallet | null
    app: string | null
    engine: Engine | null
    world: string | null
    color: number
    center: Coordinate
    zoom: number
    setWallet: (wallet: Wallet | null) => void
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
}: {
    children: ReactNode
    worldsRegistry: WorldsRegistry
    world: string
    engines: EngineConstructor<Engine>[]
    coreDefaults?: CoreDefaults
}) => {
    console.log("prov")
    const storage = createStorage({
        driver: localStorageDriver({}),
    })

    const [pixelawCore] = useState(() => new PixelawCore(engines, worldsRegistry, storage))

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        pixelawCore,
        coreStatus: "uninitialized",
        wallet: pixelawCore.getWallet(),
        app: pixelawCore.getApp(),
        engine: null,
        world: pixelawCore.getWorld(),
        color: pixelawCore.getColor(),
        center: pixelawCore.getCenter(),
        zoom: pixelawCore.getZoom(),
        setWallet: (wallet: Wallet | null) => {
            pixelawCore.setWallet(wallet)
        },
        setApp: (app: string) => {
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
            statusChanged: (newStatus: CoreStatus) => setContextValues((prev) => ({ ...prev, coreStatus: newStatus })),
            walletChanged: (newWallet: Wallet | null) => setContextValues((prev) => ({ ...prev, wallet: newWallet })),
            appChanged: (newApp: string | null) => setContextValues((prev) => ({ ...prev, app: newApp })),
            engineChanged: (newEngine: Engine | null) => setContextValues((prev) => ({ ...prev, engine: newEngine })),
            worldChanged: (newWorld: string) => setContextValues((prev) => ({ ...prev, world: newWorld })),
            colorChanged: (newColor: number) => setContextValues((prev) => ({ ...prev, color: newColor })),
            centerChanged: (newCenter: Coordinate) => setContextValues((prev) => ({ ...prev, center: newCenter })),
            zoomChanged: (newZoom: number) => setContextValues((prev) => ({ ...prev, zoom: newZoom })),
        }

        if (pixelawCore) {
            pixelawCore.loadWorld(world, coreDefaults).catch((error) => {
                console.error("Failed to load world:", error)
                setContextValues((prev) => ({
                    ...prev,
                    clientState: "error",
                    clientError: error,
                }))
            })
            console.log("loaded")
        }

        for (const [event, handler] of Object.entries(handlers)) {
            // @ts-ignore
            pixelawCore.events.on(event, handler)
        }

        return () => {
            for (const [event, handler] of Object.entries(handlers)) {
                // @ts-ignore
                pixelawCore.events.off(event, handler)
            }
        }
    }, [pixelawCore, world, coreDefaults])

    return (
        <PixelawContext.Provider value={contextValues}>
            {contextValues.engine === null ? (
                <div>Error: Engine is not initialized.</div>
            ) : (
                <ChainProvider engine={contextValues.engine}>{children}</ChainProvider>
            )}
        </PixelawContext.Provider>
    )
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("usePixelawProvider can only be used within a PixelawProvider")
    return context
}
