import { DojoWallet, type DojoWalletId } from "@pixelaw/core-dojo";
import type { DojoEngine } from "@pixelaw/core-dojo/src";
import { usePixelawProvider } from "@pixelaw/react";
import type { Connector } from "@starknet-react/core";
import {
  InjectedConnector,
  useAccount,
  useConnect,
  useDisconnect,
} from "@starknet-react/core";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { constants } from "starknet";
import {
  ArgentMobileConnector,
  isInArgentMobileAppBrowser,
} from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";

interface ConnectorContextType {
  availableConnectors: Connector[];
  handleConnectorSelection: (connector: Connector | null) => Promise<void>;
}

interface ConnectorProviderProps {
  children: ReactNode;
}

const ConnectorContext = createContext<ConnectorContextType | undefined>(
  undefined,
);

export const ConnectorProvider: React.FC<ConnectorProviderProps> = ({
  children,
}) => {
  const [availableConnectors, setAvailableConnectors] = useState<Connector[]>(
    [],
  );
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { connector: currentConnector, account: currentAccount } = useAccount();
  const { pixelawCore, wallet, setWallet, coreStatus } = usePixelawProvider();

  const engine: DojoEngine = pixelawCore.engine as DojoEngine;
  const { controllerConnector, burnerConnector } = engine.dojoSetup || {};

  // setting AvailableConnectors
  useEffect(() => {
    const connectors: Connector[] = [
      burnerConnector as unknown as Connector,
      // ...(isInArgentMobileAppBrowser()
      //     ? [
      //           ArgentMobileConnector.init({
      //               options: {
      //                   url: window?.location.href || "",
      //                   dappName: "PixeLAW",
      //                   chainId: constants.NetworkName.SN_SEPOLIA,
      //               },
      //           }),
      //       ]
      //     : [
      //           new InjectedConnector({ options: { id: "argentX" } }),
      //           new InjectedConnector({ options: { id: "braavos" } }),
      //           ArgentMobileConnector.init({
      //               options: {
      //                   url: window?.location.href || "",
      //                   dappName: "PixeLAW",
      //                   chainId: constants.NetworkName.SN_MAIN,
      //               },
      //           }),
      //           new WebWalletConnector({ url: "https://web.argent.xyz" }),
      //       ]),
      controllerConnector,
    ].filter((connector): connector is Connector => connector != null);

    setAvailableConnectors(connectors);
  }, [controllerConnector, burnerConnector]);

  // Handling connector selection (click in the wallet selector page)
  const handleConnectorSelection = async (connector: Connector | null) => {
    try {
      // Disconnect the current connector first
      if (currentConnector) await disconnectAsync();

      // If a connector was selected, connect to it.
      if (connector) {
        await connectAsync({ connector });
      } else {
        setWallet(null);
      }
    } catch (error) {
      console.error("Error activating connector:", error);
    }
  };

  // Handling Connector activation/deactivation
  useEffect(() => {
    const setCoreWalletFromConnector = async () => {
      if (currentConnector && currentAccount) {
        try {
          console.log("activateConnector", { currentAccount });
          if (!pixelawCore.wallet) {
            const chainId = await currentAccount.getChainId();

            const wallet = new DojoWallet(
              currentConnector.id as DojoWalletId,
              chainId,
              currentAccount,
            );

            pixelawCore.wallet = wallet;
          }
          pixelawCore.account = currentAccount;
        } catch (error) {
          console.error("Error setting up wallet:", error);
        }
      }
    };

    setCoreWalletFromConnector();
  }, [currentConnector, currentAccount, pixelawCore]);

  // Handling loading from BaseWallet
  useEffect(() => {
    const loadAccountForWallet = async () => {
      try {
        if (availableConnectors && coreStatus === "initAccount" && wallet) {
          console.log("loadAccountForWallet", availableConnectors);
          // Find the connector belonging to core.wallet
          const matchingConnector = availableConnectors.find(
            (connector) => connector.id === wallet.id,
          );

          // If found, connect it in the browser
          if (matchingConnector) {
            console.log("connecting", matchingConnector);
            await connectAsync({ connector: matchingConnector });
            pixelawCore.account = currentAccount;
          }
          console.log("done");
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadAccountForWallet();
  }, [
    wallet,
    availableConnectors,
    connectAsync,
    coreStatus,
    currentAccount,
    pixelawCore,
  ]);

  return (
    <ConnectorContext.Provider
      value={{ availableConnectors, handleConnectorSelection }}
    >
      {children}
    </ConnectorContext.Provider>
  );
};

export const useConnectorContext = () => {
  const context = useContext(ConnectorContext);
  if (!context) {
    throw new Error(
      "useConnectorContext must be used within a ConnectorProvider",
    );
  }
  return context;
};
