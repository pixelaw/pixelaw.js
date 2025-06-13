import type { ChainProviderProps } from "@pixelaw/react"
import { mainnet, sepolia } from "@starknet-react/chains"
import { StarknetConfig, publicProvider } from "@starknet-react/core"
import { ConnectorProvider } from "./ConnectorProvider"

export const StarknetChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
    return (
        <StarknetConfig chains={[mainnet, sepolia]} provider={publicProvider()} connectors={[]}>
            <ConnectorProvider>{children}</ConnectorProvider>
        </StarknetConfig>
    )
}
