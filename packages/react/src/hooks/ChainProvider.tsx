import { type ReactNode, Suspense } from "react";

interface ChainProviderProps {
  children: ReactNode;
  ProviderComponent: React.ComponentType<{ children: ReactNode }>;
}

export const ChainProvider = ({
  children,
  ProviderComponent,
}: ChainProviderProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProviderComponent>{children}</ProviderComponent>
    </Suspense>
  );
};
