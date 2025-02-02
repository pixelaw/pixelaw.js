import {StarknetWallet} from "@pixelaw/react-dojo";
import { mainnet } from "@starknet-react/chains"
import { StarknetConfig, publicProvider } from "@starknet-react/core"

const WalletSelectorPage = () => {
    return (
        <StarknetConfig chains={[mainnet]} provider={publicProvider()} connectors={[]}>
        <StarknetWallet/>
        </StarknetConfig>
    )
}

export default WalletSelectorPage
