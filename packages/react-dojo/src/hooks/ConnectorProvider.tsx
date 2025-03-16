import { DojoWallet, type DojoWalletId } from "@pixelaw/core-dojo"
import type { DojoEngine } from "@pixelaw/core-dojo/src"
import { usePixelawProvider } from "@pixelaw/react"
import type { Connector } from "@starknet-react/core"
import { InjectedConnector, useAccount, useConnect, useDisconnect } from "@starknet-react/core"

import { createContext, useContext, useEffect, useState } from "react"
import { constants } from "starknet"
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile"
import { WebWalletConnector } from "starknetkit/webwallet"

interface ConnectorContextType {
    availableConnectors: Connector[]
    handleConnectorSelection: (connector: Connector | null) => Promise<void>
}

interface ConnectorProviderProps {
    children: ReactNode
}

const ConnectorContext = createContext<ConnectorContextType | undefined>(undefined)

export const ConnectorProvider: React.FC<ConnectorProviderProps> = ({ children }) => {
    const [availableConnectors, setAvailableConnectors] = useState<Connector[]>([])
    const { connectAsync } = useConnect()
    const { disconnectAsync } = useDisconnect()
    const { connector: currentConnector, account: currentAccount } = useAccount()
    const { pixelawCore, wallet, setWallet } = usePixelawProvider()
    const engine: DojoEngine = pixelawCore.engine as DojoEngine
    const { controllerConnector, burnerConnector } = engine.dojoSetup || {}

    // setting AvailableConnectors
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

    // Handling connector selection
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

    // Handling Connector activation
    useEffect(() => {
        const activateConnector = async () => {
            if (currentConnector && currentAccount) {
                console.log("Handling Connector activation")
                try {
                    console.log("activateConnector", { currentAccount })
                    const chainId = await currentAccount.getChainId()
                    const wallet = new DojoWallet(currentConnector.id as DojoWalletId, chainId, currentAccount)
                    setWallet(wallet)
                    // navigate("/");
                } catch (error) {
                    console.error("Error setting up wallet:", error)
                }
            }
        }

        activateConnector()
    }, [currentConnector, currentAccount, setWallet])

    // Handling loading from BaseWallet
    useEffect(() => {
        const activateConnector = async () => {
            if (wallet && !(typeof wallet["getAccount"] === "function")) {
                const matchingConnector = availableConnectors.find((connector) => connector.id === wallet.id)

                if (matchingConnector) {
                    await connectAsync({ connector: matchingConnector })
                }
            }
        }

        activateConnector()
    }, [wallet, availableConnectors, connectAsync])

    return (
        <ConnectorContext.Provider value={{ availableConnectors, handleConnectorSelection }}>
            {children}
        </ConnectorContext.Provider>
    )
}

export const useConnectorContext = () => {
    const context = useContext(ConnectorContext)
    if (!context) {
        throw new Error("useConnectorContext must be used within a ConnectorProvider")
    }
    return context
}
