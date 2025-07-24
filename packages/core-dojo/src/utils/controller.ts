import ControllerConnector from "@cartridge/connector/controller";
import type { SessionPolicies } from "@cartridge/controller";
import type { Manifest } from "@dojoengine/core";
import { shortString } from "starknet";

interface ConnectorParams {
  rpcUrl: string;
  feeTokenAddress: string;
  manifest: Manifest;
}

export const getControllerConnector = ({
  rpcUrl,
  feeTokenAddress,
  manifest,
}: ConnectorParams): ControllerConnector => {
  const contracts = {};
  const messages = [
    {
      name: "PixelAW Message Signing",
      description: "Allows signing messages for Pixelaw",
      types: {
        StarknetDomain: [
          { name: "name", type: "shortstring" },
          { name: "version", type: "shortstring" },
          { name: "chainId", type: "shortstring" },
          { name: "revision", type: "shortstring" },
        ],
        "pixelaw-Position": [
          { name: "x", type: "u16" },
          { name: "y", type: "u16" },
        ],
        "pixelaw-Pixel": [
          { name: "position", type: "pixelaw-Position" },
          { name: "action", type: "shortstring" },
          { name: "color", type: "shortstring" },
          { name: "owner", type: "shortstring" },
          { name: "text", type: "shortstring" },
          { name: "timestamp", type: "shortstring" },
          { name: "app", type: "shortstring" },
        ],
      },
      primaryType: "pixelaw-Pixel",
      domain: {
        name: "pixelaw",
        version: "1",
        chainId: "SN_SEPOLIA",
        revision: "1",
      },
    },
  ];

  contracts[manifest.contracts[0].address] = {
    name: manifest.contracts[0].tag,
    description: "",
    methods: [
      {
        name: "process_queue",
        description: "Process Queue item",
        entrypoint: "process_queue",
      },
    ],
  };

  for (const contract of manifest.contracts) {
    if (contract.name.length === 0) continue;
    contracts[contract.address] = {
      name: contract.name,
      description: "",
      methods: [
        {
          name: "interact",
          description: `Interact with ${contract.name}`,
          entrypoint: "interact",
        },
      ],
    };
  }

  const policies: SessionPolicies = {
    // TODO for now not doing signed messages due to torii changes
    // messages,
    contracts,
  };

  return new ControllerConnector({
    policies,
    defaultChainId: shortString.encodeShortString("SN_SEPOLIA"),
    chains: [
      { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
      { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
    ],
    propagateSessionErrors: true,
    // profileUrl,
    // slot: "pixelaw-slot",
    // preset: "pixelaw",
    namespace: "pixelaw",
    // tokens: {
    //     erc20: [
    //         // $LORDS
    //         // "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
    //         // $FLIP
    //         // "0x01bfe97d729138fc7c2d93c77d6d1d8a24708d5060608017d9b384adf38f04c7",
    //     ],
    // },
  });
};
