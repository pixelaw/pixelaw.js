import type ControllerConnector from "@cartridge/connector/controller"
import { type DojoEngine, DojoWallet , type DojoWalletId} from "@pixelaw/core-dojo"
import { usePixelawProvider } from "@pixelaw/react"
import { type Connector, InjectedConnector, useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { constants } from "starknet"
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile"
import { WebWalletConnector } from "starknetkit/webwallet"
import ControllerDetails from "../ControllerDetails/ControllerDetails"
import styles from "./StarknetWallet.module.css"

export const StarknetWallet = () => {
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
            if (currentConnector) await disconnectAsync()
            if (connector) {
                await connectAsync({ connector })
            }
        } catch (error) {
            console.error("Error activating connector:", error)
        }
    }

    useEffect(() => {
        const connectors: Connector[] = [
            ...(isInArgentMobileAppBrowser()
                ? [
                      ArgentMobileConnector.init({
                          options: {
                              url: window?.location.href || "",
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
                              url: window?.location.href || "",
                              dappName: "PixeLAW",
                              chainId: constants.NetworkName.SN_MAIN,
                          },
                      }),
                      new WebWalletConnector({ url: "https://web.argent.xyz" }),
                  ]),
            controllerConnector,
            burnerConnector as Connector,
        ].filter((connector): connector is Connector => connector != null)

        setAvailableConnectors(connectors)
    }, [controllerConnector, burnerConnector])

    useEffect(() => {
        const setupWallet = async () => {
            if (currentConnector && currentAccount) {
                try {
                    const chainId = await currentAccount.getChainId()
                    const wallet = new DojoWallet(currentConnector.id as DojoWalletId, chainId, currentAccount)
                    pixelawCore.setWallet(wallet)
                    navigate("/")
                } catch (error) {
                    console.error("Error setting up wallet:", error)
                }
            }
        }

        setupWallet()
    }, [currentConnector, currentAccount, navigate])

    return (
        <div className={styles.inner}>
            <h1>Current Wallet</h1>
            {currentConnector?.id === "controller" && (
                <ControllerDetails connector={currentConnector as ControllerConnector} />
            )}
            <p>
                {currentConnector ? currentConnector.id : "none"} {status}{" "}
                {currentAccount ? currentAccount.address : "no account"}
            </p>

            <h1>Wallet Selector</h1>
            <ul className={styles.settingsList}>
                <li key="">
                    <button type="button" className={styles.menuButton} onClick={() => handleConnectorSelection(null)}>
                        None
                    </button>
                </li>
                {availableConnectors.map((availConnector) => (
                    <li key={availConnector.id}>
                        <button
                            type="button"
                            className={styles.menuButton}
                            onClick={() => handleConnectorSelection(availConnector)}
                            disabled={currentConnector?.id === availConnector.id}
                        >
                            {currentConnector?.id === availConnector.id
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
