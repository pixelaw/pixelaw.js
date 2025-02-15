import type ControllerConnector from "@cartridge/connector/controller";
import { useAccount } from "@starknet-react/core";
import { useConnectorContext } from "../../hooks/ConnectorProvider"; // Import the new provider
import ControllerDetails from "../ControllerDetails/ControllerDetails";
import styles from "./StarknetWallet.module.css";

export const StarknetWallet = () => {
    const { connector: currentConnector, account: currentAccount, status } = useAccount();
    const { availableConnectors, handleConnectorSelection } = useConnectorContext(); // Use the context

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
    );
};

export default StarknetWallet;
