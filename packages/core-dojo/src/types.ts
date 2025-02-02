import type {WalletConfig} from "@pixelaw/core";

export interface DojoConfig {
    serverUrl: string
    rpcUrl: string
    toriiUrl: string
    relayUrl: string
    feeTokenAddress: string
    wallets: {
        burner?: WalletConfig
        controller?: WalletConfig
    }
    world: string
}

export interface DojoWorldConfig {
    engine: "dojo"
    description: string
    config: DojoConfig
}