import { mainnet } from "@starknet-react/chains"
import { StarknetConfig, publicProvider } from "@starknet-react/core"
import StarknetWallet from "../components/StarknetWallet/StarknetWallet"
import { ConnectorProvider } from "../hooks/ConnectorProvider";

export const StarknetWalletSelectorPage = () => {
    return (
        <StarknetConfig chains={[mainnet]} provider={publicProvider()} connectors={[]}>
            <ConnectorProvider>
                <StarknetWallet />
            </ConnectorProvider>
        </StarknetConfig>
    )
}
