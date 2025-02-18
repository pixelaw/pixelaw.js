import type { Engine } from "@pixelaw/core"
import { type ReactNode, Suspense, lazy } from "react"

// TODO future mud support
// const MudProvider = lazy(() => import('@pixelaw/react-mud'));

const StarknetChainProvider = lazy(() =>
    import("@pixelaw/react-dojo").then((module) => ({ default: module.StarknetChainProvider })),
)

export const ChainProvider = ({ engine, children }: { engine: Engine; children: ReactNode }) => {
    // biome-ignore lint/suspicious/noImplicitAnyLet: TODO
    let ProviderComponent
    switch (engine.id) {
        // case 'mud':
        //     ProviderComponent = MudProvider;
        //     break;
        case "dojo":
            ProviderComponent = StarknetChainProvider
            break
        default:
            throw new Error("Unknown provider type")
    }
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProviderComponent>{children}</ProviderComponent>
        </Suspense>
    )
}
