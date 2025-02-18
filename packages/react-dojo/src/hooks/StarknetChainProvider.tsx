import type {ChainProviderProps} from "@pixelaw/react"
import {devnet, mainnet, sepolia} from "@starknet-react/chains"
import {publicProvider, StarknetConfig} from "@starknet-react/core"
import {ConnectorProvider} from "./ConnectorProvider"

export const StarknetChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
    return (
        <StarknetConfig chains={[mainnet, devnet, sepolia]} provider={publicProvider()} connectors={[]}>
            <ConnectorProvider>{children}</ConnectorProvider>
        </StarknetConfig>
    )
}
