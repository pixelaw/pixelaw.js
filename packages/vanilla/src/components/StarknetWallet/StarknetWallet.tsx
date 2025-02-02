import ControllerDetails from "@/components/Wallet/ControllerDetails.tsx"
import { usePixelawProvider } from "@/hooks/PixelawProvider.tsx"

import type {DojoEngine} from "@pixelaw/core-dojo"
import { type Connector, InjectedConnector, useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { constants } from "starknet"
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile"
import { WebWalletConnector } from "starknetkit/webwallet"
import styles from "./StarknetWallet.module.css"

const StarknetWallet = () => {
    // const { setWallet } = useSettingStore()
    const { connectAsync } = useConnect()
    const { disconnectAsync } = useDisconnect()
    const { connector: currentConnector, account: currentAccount, status } = useAccount()

    const [availableConnectors, setAvailableConnectors] = useState<Connector[]>([])

    const { pixelawCore } = usePixelawProvider()
    const engine = pixelawCore.engine as DojoEngine
    const { controllerConnector, burnerConnector } = engine.dojoSetup || {}

    const navigate = useNavigate()
    const handleConnectorSelection = async (connector: Connector | null) => {
        try {
            await activateConnector(connector)
            navigate("/")
        } catch (error) {
            console.error("Error activating connector:", error)
        }
    }
    useEffect(() => {
        const connectors = isInArgentMobileAppBrowser()
            ? [
                ArgentMobileConnector.init({
                    options: {
                        url: typeof window !== "undefined" ? window.location.href : "",
                        dappName: "PixeLAW",
                        chainId: constants.NetworkName.SN_SEPOLIA,
                    },
                }),
            ]
            : [
                new InjectedConnector({ options: { id: "argentX" } }),
                new InjectedConnector({ options: { id: "braavos" } }),
                ArgentMobileConnector.init({
                    options: {
                        url: typeof window !== "undefined" ? window.location.href : "",
                        dappName: "PixeLAW",
                        chainId: constants.NetworkName.SN_MAIN,
                    },
                }),
                new WebWalletConnector({ url: "https://web.argent.xyz" }),
            ]

        if (controllerConnector) {
            connectors.push(controllerConnector)
        }

        if (burnerConnector) {
            connectors.push(burnerConnector as unknown as Connector)
        }

        setAvailableConnectors(connectors)
    }, [controllerConnector, burnerConnector])

    const activateConnector = async (newConnector: Connector | null) => {
        try {
            if (currentConnector) {
                await disconnectAsync()
            }
            if (newConnector) {
                await connectAsync({ connector: newConnector })
                setWallet(newConnector.id)
            } else {
                setWallet("")
            }
            navigate("/")
        } catch (error) {
            console.error("Activation failed:", error)
        }
    }

    useEffect(() => {
        if (currentConnector) {
            setWallet(currentConnector.id)
        }
    }, [currentConnector, setWallet])

    return (
        <div className={styles.inner}>
            <h1>Current Wallet</h1>
            {currentConnector && currentConnector.id === "controller" ? (
                <ControllerDetails connector={currentConnector as ControllerConnector} />
            ) : (
                ""
            )}
            <p>
                {currentConnector ? currentConnector.id : "none"} {status}{" "}
                {currentAccount ? currentAccount.address : "no account"}
            </p>

            <h1>Wallet Selector</h1>
            <ul className={styles.settingsList}>
                <li key="">
                    <button
                        type={"button"}
                        className={styles.menuButton}
                        onClick={() => handleConnectorSelection(null)}
                    >
                        None
                    </button>
                </li>
                {Object.entries(availableConnectors).map(([, availConnector]) => (
                    <li key={availConnector.id}>
                        <button
                            type={"button"}
                            className={styles.menuButton}
                            onClick={() => handleConnectorSelection(availConnector)}
                            disabled={currentConnector && currentConnector.id === availConnector.id}
                        >
                            {currentConnector && currentConnector.id === availConnector.id
                                ? `${availConnector.id} (Connected)`
                                : `Connect to ${availConnector.id}`}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default StarknetWallet
