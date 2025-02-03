import { usePixelawProvider } from "@pixelaw/react"
import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styles from "./MenuBar.module.css"

// import { useAccount } from "@starknet-react/core"
// import { type Connector, useConnect } from "@starknet-react/core"
import { DojoEngine } from "@pixelaw/core-dojo"

const MenuBar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { pixelawCore: {engine} } = usePixelawProvider()
    // const { address } = useAccount()
    // const { connectAsync, connectors } = useConnect()

    if (!(engine instanceof DojoEngine)) return null;

    if (!engine.dojoSetup) return

    // const address = engine.dojoSetup.

    // Determine if the settings page is shown based on the current path
    const showSettings = location.pathname === "/settings"
    const showWorldSelector = location.pathname === "/world"
    const showWalletSelector = location.pathname === "/wallet"

    // const temp = async () => {
    //     console.log(connectors)
    //     await connectAsync({ connector: engine.dojoSetup!.controllerConnector! })
    // }

    const toggleSettings = () => {
        if (showSettings) {
            navigate("/")
        } else {
            navigate("/settings") // Navigate to settings if not currently showing
        }
    }
    const toggleWalletSelector = () => {
        if (showWalletSelector) {
            navigate("/")
        } else {
            navigate("/wallet")
        }
    }

    const toggleWorldSelector = () => {
        if (showWorldSelector) {
            navigate("/")
        } else {
            navigate("/world") // Navigate to settings if not currently showing
        }
    }
    return (
        <div className={styles.inner}>
            <div className={styles.logoContainer}>
                <img src="/assets/logo/pixeLaw-logo.png" alt="logo" />
            </div>
            <div className={styles.rightSection}>
                <button type={"button"} className={styles.menuButton} onClick={toggleWalletSelector}>
                    Wallet
                </button>
                <button type={"button"} className={styles.menuButton} onClick={toggleWorldSelector}>
                    World ()
                </button>
                <button type={"button"} className={styles.menuButton} onClick={toggleSettings}>
                    Settings
                </button>

            </div>
        </div>
    )
}

export default MenuBar
