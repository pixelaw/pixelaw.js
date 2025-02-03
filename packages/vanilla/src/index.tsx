import Main from "@/Main.tsx"
import React from "react"
import ReactDOM from "react-dom/client"
import "@/index.css"
import { PixelawProvider } from "@pixelaw/react"
import { BrowserRouter } from "react-router-dom"

import worldsConfig from "@/config/worlds.json"
import { DEFAULT_WORLD } from "@/global/constants.ts"

const worldConfig = worldsConfig[DEFAULT_WORLD]

const rootElement = document.getElementById("root")

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <PixelawProvider worldConfig={worldConfig}>
                    <BrowserRouter>
                        <Main />
                    </BrowserRouter>
                </PixelawProvider>
        </React.StrictMode>,
    )
} else {
    console.error("Failed to find the root element")
}
