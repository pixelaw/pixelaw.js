import type { Engine } from "@pixelaw/core"
import { type ReactNode, Suspense, lazy } from "react"

export const ChainProvider = ({ engine, children }: { engine: Engine; children: ReactNode }) => {
    const dependencyName = `@pixelaw/react-${engine}`
    const ProviderComponent: React.ComponentType<{ children: ReactNode }> = lazy(() =>
        import(dependencyName)
            .then((module) => ({ default: module.StarknetChainProvider }))
            .catch((e) => {
                console.error(`Is ${dependencyName} registered as dependency?`, e)
                return { default: () => <div>Error loading provider</div> }
            }),
    )
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProviderComponent>{children}</ProviderComponent>
        </Suspense>
    )
}
