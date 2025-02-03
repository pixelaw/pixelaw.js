import { mainnet } from "@starknet-react/chains"
import { StarknetConfig, publicProvider } from "@starknet-react/core"
import StarknetWallet from "../components/StarknetWallet/StarknetWallet"

export const StarknetWalletSelectorPage = () => {
    return (
        <StarknetConfig chains={[mainnet]} provider={publicProvider()} connectors={[]}>
            <StarknetWallet />
        </StarknetConfig>
    )
}
