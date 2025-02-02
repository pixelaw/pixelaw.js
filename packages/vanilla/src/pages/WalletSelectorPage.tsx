
import { StarknetConfig, publicProvider } from "@starknet-react/core"
import { mainnet } from "@starknet-react/chains"
import StarknetWallet from "@/components/StarknetWallet/StarknetWallet.tsx";

const WalletSelectorPage = () => {
    return (
        <StarknetConfig chains={[mainnet]} provider={publicProvider()} connectors={[]}>
        <StarknetWallet/>
        </StarknetConfig>
    )
}

export default WalletSelectorPage
