// src/DojoEngine.ts
import { NAMESPACE as NAMESPACE2, RestTileStore, WsUpdateService, createDialog } from "@pixelaw/core";

// src/DojoEngine.init.ts
import { DojoProvider } from "@dojoengine/core";
import { BurnerConnector, BurnerManager } from "@dojoengine/create-burner";
import { init } from "@dojoengine/sdk";
import { Account, RpcProvider } from "starknet";

// src/utils/controller.ts
import ControllerConnector from "@cartridge/connector/controller";
var getControllerConnector = ({ rpcUrl, feeTokenAddress, manifest }) => {
  const policies = [
    {
      target: feeTokenAddress,
      method: "approve"
    },
    {
      target: feeTokenAddress,
      method: "approve",
      description: "approve"
    },
    {
      target: feeTokenAddress,
      method: "transfer"
    },
    {
      target: feeTokenAddress,
      method: "mint"
    },
    {
      target: feeTokenAddress,
      method: "burn"
    },
    {
      target: feeTokenAddress,
      method: "allowance"
    }
  ];
  for (const contract of manifest.contracts) {
  }
  return new ControllerConnector({
    // policies,
    defaultChainId: "0x534e5f4d41494e",
    // TODO this is just copied from a debug, and it makes it not crash...
    chains: [{ rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" }]
    // profileUrl,
    // slot: "pixelaw-slot",
    // preset: "pixelaw",
    // namespace: "pixelaw",
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

// src/utils/manifest.ts
function manifest_default(worldAddress) {
  return {
    "world": {
      "class_hash": "0x45575a88cc5cef1e444c77ce60b7b4c9e73a01cbbe20926d5a4c72a94011410",
      "address": worldAddress,
      "seed": "pixelaw",
      "name": "pixelaw",
      "entrypoints": [
        "uuid",
        "set_metadata",
        "register_namespace",
        "register_event",
        "register_model",
        "register_contract",
        "init_contract",
        "upgrade_event",
        "upgrade_model",
        "upgrade_contract",
        "emit_event",
        "emit_events",
        "set_entity",
        "set_entities",
        "delete_entity",
        "delete_entities",
        "grant_owner",
        "revoke_owner",
        "grant_writer",
        "revoke_writer",
        "upgrade"
      ],
      "abi": [
        {
          "type": "impl",
          "name": "World",
          "interface_name": "dojo::world::iworld::IWorld"
        },
        {
          "type": "struct",
          "name": "core::byte_array::ByteArray",
          "members": [
            {
              "name": "data",
              "type": "core::array::Array::<core::bytes_31::bytes31>"
            },
            {
              "name": "pending_word",
              "type": "core::felt252"
            },
            {
              "name": "pending_word_len",
              "type": "core::integer::u32"
            }
          ]
        },
        {
          "type": "enum",
          "name": "dojo::world::resource::Resource",
          "variants": [
            {
              "name": "Model",
              "type": "(core::starknet::contract_address::ContractAddress, core::felt252)"
            },
            {
              "name": "Event",
              "type": "(core::starknet::contract_address::ContractAddress, core::felt252)"
            },
            {
              "name": "Contract",
              "type": "(core::starknet::contract_address::ContractAddress, core::felt252)"
            },
            {
              "name": "Namespace",
              "type": "core::byte_array::ByteArray"
            },
            {
              "name": "World",
              "type": "()"
            },
            {
              "name": "Unregistered",
              "type": "()"
            }
          ]
        },
        {
          "type": "struct",
          "name": "dojo::model::metadata::ResourceMetadata",
          "members": [
            {
              "name": "resource_id",
              "type": "core::felt252"
            },
            {
              "name": "metadata_uri",
              "type": "core::byte_array::ByteArray"
            },
            {
              "name": "metadata_hash",
              "type": "core::felt252"
            }
          ]
        },
        {
          "type": "struct",
          "name": "core::array::Span::<core::felt252>",
          "members": [
            {
              "name": "snapshot",
              "type": "@core::array::Array::<core::felt252>"
            }
          ]
        },
        {
          "type": "struct",
          "name": "core::array::Span::<core::array::Span::<core::felt252>>",
          "members": [
            {
              "name": "snapshot",
              "type": "@core::array::Array::<core::array::Span::<core::felt252>>"
            }
          ]
        },
        {
          "type": "enum",
          "name": "dojo::model::definition::ModelIndex",
          "variants": [
            {
              "name": "Keys",
              "type": "core::array::Span::<core::felt252>"
            },
            {
              "name": "Id",
              "type": "core::felt252"
            },
            {
              "name": "MemberId",
              "type": "(core::felt252, core::felt252)"
            }
          ]
        },
        {
          "type": "struct",
          "name": "core::array::Span::<core::integer::u8>",
          "members": [
            {
              "name": "snapshot",
              "type": "@core::array::Array::<core::integer::u8>"
            }
          ]
        },
        {
          "type": "struct",
          "name": "dojo::meta::layout::FieldLayout",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252"
            },
            {
              "name": "layout",
              "type": "dojo::meta::layout::Layout"
            }
          ]
        },
        {
          "type": "struct",
          "name": "core::array::Span::<dojo::meta::layout::FieldLayout>",
          "members": [
            {
              "name": "snapshot",
              "type": "@core::array::Array::<dojo::meta::layout::FieldLayout>"
            }
          ]
        },
        {
          "type": "struct",
          "name": "core::array::Span::<dojo::meta::layout::Layout>",
          "members": [
            {
              "name": "snapshot",
              "type": "@core::array::Array::<dojo::meta::layout::Layout>"
            }
          ]
        },
        {
          "type": "enum",
          "name": "dojo::meta::layout::Layout",
          "variants": [
            {
              "name": "Fixed",
              "type": "core::array::Span::<core::integer::u8>"
            },
            {
              "name": "Struct",
              "type": "core::array::Span::<dojo::meta::layout::FieldLayout>"
            },
            {
              "name": "Tuple",
              "type": "core::array::Span::<dojo::meta::layout::Layout>"
            },
            {
              "name": "Array",
              "type": "core::array::Span::<dojo::meta::layout::Layout>"
            },
            {
              "name": "ByteArray",
              "type": "()"
            },
            {
              "name": "Enum",
              "type": "core::array::Span::<dojo::meta::layout::FieldLayout>"
            }
          ]
        },
        {
          "type": "struct",
          "name": "core::array::Span::<dojo::model::definition::ModelIndex>",
          "members": [
            {
              "name": "snapshot",
              "type": "@core::array::Array::<dojo::model::definition::ModelIndex>"
            }
          ]
        },
        {
          "type": "enum",
          "name": "core::bool",
          "variants": [
            {
              "name": "False",
              "type": "()"
            },
            {
              "name": "True",
              "type": "()"
            }
          ]
        },
        {
          "type": "interface",
          "name": "dojo::world::iworld::IWorld",
          "items": [
            {
              "type": "function",
              "name": "resource",
              "inputs": [
                {
                  "name": "selector",
                  "type": "core::felt252"
                }
              ],
              "outputs": [
                {
                  "type": "dojo::world::resource::Resource"
                }
              ],
              "state_mutability": "view"
            },
            {
              "type": "function",
              "name": "uuid",
              "inputs": [],
              "outputs": [
                {
                  "type": "core::integer::u32"
                }
              ],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "metadata",
              "inputs": [
                {
                  "name": "resource_selector",
                  "type": "core::felt252"
                }
              ],
              "outputs": [
                {
                  "type": "dojo::model::metadata::ResourceMetadata"
                }
              ],
              "state_mutability": "view"
            },
            {
              "type": "function",
              "name": "set_metadata",
              "inputs": [
                {
                  "name": "metadata",
                  "type": "dojo::model::metadata::ResourceMetadata"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "register_namespace",
              "inputs": [
                {
                  "name": "namespace",
                  "type": "core::byte_array::ByteArray"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "register_event",
              "inputs": [
                {
                  "name": "namespace",
                  "type": "core::byte_array::ByteArray"
                },
                {
                  "name": "class_hash",
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "register_model",
              "inputs": [
                {
                  "name": "namespace",
                  "type": "core::byte_array::ByteArray"
                },
                {
                  "name": "class_hash",
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "register_contract",
              "inputs": [
                {
                  "name": "salt",
                  "type": "core::felt252"
                },
                {
                  "name": "namespace",
                  "type": "core::byte_array::ByteArray"
                },
                {
                  "name": "class_hash",
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "outputs": [
                {
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "init_contract",
              "inputs": [
                {
                  "name": "selector",
                  "type": "core::felt252"
                },
                {
                  "name": "init_calldata",
                  "type": "core::array::Span::<core::felt252>"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "upgrade_event",
              "inputs": [
                {
                  "name": "namespace",
                  "type": "core::byte_array::ByteArray"
                },
                {
                  "name": "class_hash",
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "upgrade_model",
              "inputs": [
                {
                  "name": "namespace",
                  "type": "core::byte_array::ByteArray"
                },
                {
                  "name": "class_hash",
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "upgrade_contract",
              "inputs": [
                {
                  "name": "namespace",
                  "type": "core::byte_array::ByteArray"
                },
                {
                  "name": "class_hash",
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "outputs": [
                {
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "emit_event",
              "inputs": [
                {
                  "name": "event_selector",
                  "type": "core::felt252"
                },
                {
                  "name": "keys",
                  "type": "core::array::Span::<core::felt252>"
                },
                {
                  "name": "values",
                  "type": "core::array::Span::<core::felt252>"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "emit_events",
              "inputs": [
                {
                  "name": "event_selector",
                  "type": "core::felt252"
                },
                {
                  "name": "keys",
                  "type": "core::array::Span::<core::array::Span::<core::felt252>>"
                },
                {
                  "name": "values",
                  "type": "core::array::Span::<core::array::Span::<core::felt252>>"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "entity",
              "inputs": [
                {
                  "name": "model_selector",
                  "type": "core::felt252"
                },
                {
                  "name": "index",
                  "type": "dojo::model::definition::ModelIndex"
                },
                {
                  "name": "layout",
                  "type": "dojo::meta::layout::Layout"
                }
              ],
              "outputs": [
                {
                  "type": "core::array::Span::<core::felt252>"
                }
              ],
              "state_mutability": "view"
            },
            {
              "type": "function",
              "name": "entities",
              "inputs": [
                {
                  "name": "model_selector",
                  "type": "core::felt252"
                },
                {
                  "name": "indexes",
                  "type": "core::array::Span::<dojo::model::definition::ModelIndex>"
                },
                {
                  "name": "layout",
                  "type": "dojo::meta::layout::Layout"
                }
              ],
              "outputs": [
                {
                  "type": "core::array::Span::<core::array::Span::<core::felt252>>"
                }
              ],
              "state_mutability": "view"
            },
            {
              "type": "function",
              "name": "set_entity",
              "inputs": [
                {
                  "name": "model_selector",
                  "type": "core::felt252"
                },
                {
                  "name": "index",
                  "type": "dojo::model::definition::ModelIndex"
                },
                {
                  "name": "values",
                  "type": "core::array::Span::<core::felt252>"
                },
                {
                  "name": "layout",
                  "type": "dojo::meta::layout::Layout"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "set_entities",
              "inputs": [
                {
                  "name": "model_selector",
                  "type": "core::felt252"
                },
                {
                  "name": "indexes",
                  "type": "core::array::Span::<dojo::model::definition::ModelIndex>"
                },
                {
                  "name": "values",
                  "type": "core::array::Span::<core::array::Span::<core::felt252>>"
                },
                {
                  "name": "layout",
                  "type": "dojo::meta::layout::Layout"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "delete_entity",
              "inputs": [
                {
                  "name": "model_selector",
                  "type": "core::felt252"
                },
                {
                  "name": "index",
                  "type": "dojo::model::definition::ModelIndex"
                },
                {
                  "name": "layout",
                  "type": "dojo::meta::layout::Layout"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "delete_entities",
              "inputs": [
                {
                  "name": "model_selector",
                  "type": "core::felt252"
                },
                {
                  "name": "indexes",
                  "type": "core::array::Span::<dojo::model::definition::ModelIndex>"
                },
                {
                  "name": "layout",
                  "type": "dojo::meta::layout::Layout"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "is_owner",
              "inputs": [
                {
                  "name": "resource",
                  "type": "core::felt252"
                },
                {
                  "name": "address",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [
                {
                  "type": "core::bool"
                }
              ],
              "state_mutability": "view"
            },
            {
              "type": "function",
              "name": "grant_owner",
              "inputs": [
                {
                  "name": "resource",
                  "type": "core::felt252"
                },
                {
                  "name": "address",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "revoke_owner",
              "inputs": [
                {
                  "name": "resource",
                  "type": "core::felt252"
                },
                {
                  "name": "address",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "is_writer",
              "inputs": [
                {
                  "name": "resource",
                  "type": "core::felt252"
                },
                {
                  "name": "contract",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [
                {
                  "type": "core::bool"
                }
              ],
              "state_mutability": "view"
            },
            {
              "type": "function",
              "name": "grant_writer",
              "inputs": [
                {
                  "name": "resource",
                  "type": "core::felt252"
                },
                {
                  "name": "contract",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "type": "function",
              "name": "revoke_writer",
              "inputs": [
                {
                  "name": "resource",
                  "type": "core::felt252"
                },
                {
                  "name": "contract",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            }
          ]
        },
        {
          "type": "impl",
          "name": "UpgradeableWorld",
          "interface_name": "dojo::world::iworld::IUpgradeableWorld"
        },
        {
          "type": "interface",
          "name": "dojo::world::iworld::IUpgradeableWorld",
          "items": [
            {
              "type": "function",
              "name": "upgrade",
              "inputs": [
                {
                  "name": "new_class_hash",
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            }
          ]
        },
        {
          "type": "constructor",
          "name": "constructor",
          "inputs": [
            {
              "name": "world_class_hash",
              "type": "core::starknet::class_hash::ClassHash"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::WorldSpawned",
          "kind": "struct",
          "members": [
            {
              "name": "creator",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "data"
            },
            {
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::WorldUpgraded",
          "kind": "struct",
          "members": [
            {
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::NamespaceRegistered",
          "kind": "struct",
          "members": [
            {
              "name": "namespace",
              "type": "core::byte_array::ByteArray",
              "kind": "key"
            },
            {
              "name": "hash",
              "type": "core::felt252",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::ModelRegistered",
          "kind": "struct",
          "members": [
            {
              "name": "name",
              "type": "core::byte_array::ByteArray",
              "kind": "key"
            },
            {
              "name": "namespace",
              "type": "core::byte_array::ByteArray",
              "kind": "key"
            },
            {
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash",
              "kind": "data"
            },
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::EventRegistered",
          "kind": "struct",
          "members": [
            {
              "name": "name",
              "type": "core::byte_array::ByteArray",
              "kind": "key"
            },
            {
              "name": "namespace",
              "type": "core::byte_array::ByteArray",
              "kind": "key"
            },
            {
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash",
              "kind": "data"
            },
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::ContractRegistered",
          "kind": "struct",
          "members": [
            {
              "name": "name",
              "type": "core::byte_array::ByteArray",
              "kind": "key"
            },
            {
              "name": "namespace",
              "type": "core::byte_array::ByteArray",
              "kind": "key"
            },
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "data"
            },
            {
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash",
              "kind": "data"
            },
            {
              "name": "salt",
              "type": "core::felt252",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::ModelUpgraded",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash",
              "kind": "data"
            },
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "data"
            },
            {
              "name": "prev_address",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::EventUpgraded",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash",
              "kind": "data"
            },
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "data"
            },
            {
              "name": "prev_address",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::ContractUpgraded",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::ContractInitialized",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "init_calldata",
              "type": "core::array::Span::<core::felt252>",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::EventEmitted",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "system_address",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "key"
            },
            {
              "name": "keys",
              "type": "core::array::Span::<core::felt252>",
              "kind": "data"
            },
            {
              "name": "values",
              "type": "core::array::Span::<core::felt252>",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::MetadataUpdate",
          "kind": "struct",
          "members": [
            {
              "name": "resource",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "uri",
              "type": "core::byte_array::ByteArray",
              "kind": "data"
            },
            {
              "name": "hash",
              "type": "core::felt252",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::StoreSetRecord",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "entity_id",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "keys",
              "type": "core::array::Span::<core::felt252>",
              "kind": "data"
            },
            {
              "name": "values",
              "type": "core::array::Span::<core::felt252>",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::StoreUpdateRecord",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "entity_id",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "values",
              "type": "core::array::Span::<core::felt252>",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::StoreUpdateMember",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "entity_id",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "member_selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "values",
              "type": "core::array::Span::<core::felt252>",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::StoreDelRecord",
          "kind": "struct",
          "members": [
            {
              "name": "selector",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "entity_id",
              "type": "core::felt252",
              "kind": "key"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::WriterUpdated",
          "kind": "struct",
          "members": [
            {
              "name": "resource",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "contract",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "key"
            },
            {
              "name": "value",
              "type": "core::bool",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::OwnerUpdated",
          "kind": "struct",
          "members": [
            {
              "name": "resource",
              "type": "core::felt252",
              "kind": "key"
            },
            {
              "name": "contract",
              "type": "core::starknet::contract_address::ContractAddress",
              "kind": "key"
            },
            {
              "name": "value",
              "type": "core::bool",
              "kind": "data"
            }
          ]
        },
        {
          "type": "event",
          "name": "dojo::world::world_contract::world::Event",
          "kind": "enum",
          "variants": [
            {
              "name": "WorldSpawned",
              "type": "dojo::world::world_contract::world::WorldSpawned",
              "kind": "nested"
            },
            {
              "name": "WorldUpgraded",
              "type": "dojo::world::world_contract::world::WorldUpgraded",
              "kind": "nested"
            },
            {
              "name": "NamespaceRegistered",
              "type": "dojo::world::world_contract::world::NamespaceRegistered",
              "kind": "nested"
            },
            {
              "name": "ModelRegistered",
              "type": "dojo::world::world_contract::world::ModelRegistered",
              "kind": "nested"
            },
            {
              "name": "EventRegistered",
              "type": "dojo::world::world_contract::world::EventRegistered",
              "kind": "nested"
            },
            {
              "name": "ContractRegistered",
              "type": "dojo::world::world_contract::world::ContractRegistered",
              "kind": "nested"
            },
            {
              "name": "ModelUpgraded",
              "type": "dojo::world::world_contract::world::ModelUpgraded",
              "kind": "nested"
            },
            {
              "name": "EventUpgraded",
              "type": "dojo::world::world_contract::world::EventUpgraded",
              "kind": "nested"
            },
            {
              "name": "ContractUpgraded",
              "type": "dojo::world::world_contract::world::ContractUpgraded",
              "kind": "nested"
            },
            {
              "name": "ContractInitialized",
              "type": "dojo::world::world_contract::world::ContractInitialized",
              "kind": "nested"
            },
            {
              "name": "EventEmitted",
              "type": "dojo::world::world_contract::world::EventEmitted",
              "kind": "nested"
            },
            {
              "name": "MetadataUpdate",
              "type": "dojo::world::world_contract::world::MetadataUpdate",
              "kind": "nested"
            },
            {
              "name": "StoreSetRecord",
              "type": "dojo::world::world_contract::world::StoreSetRecord",
              "kind": "nested"
            },
            {
              "name": "StoreUpdateRecord",
              "type": "dojo::world::world_contract::world::StoreUpdateRecord",
              "kind": "nested"
            },
            {
              "name": "StoreUpdateMember",
              "type": "dojo::world::world_contract::world::StoreUpdateMember",
              "kind": "nested"
            },
            {
              "name": "StoreDelRecord",
              "type": "dojo::world::world_contract::world::StoreDelRecord",
              "kind": "nested"
            },
            {
              "name": "WriterUpdated",
              "type": "dojo::world::world_contract::world::WriterUpdated",
              "kind": "nested"
            },
            {
              "name": "OwnerUpdated",
              "type": "dojo::world::world_contract::world::OwnerUpdated",
              "kind": "nested"
            }
          ]
        }
      ]
    },
    "contracts": [
      {
        "address": "0x1fbb7fd4fd72452b9a575bddb6ca06f6b854a66e8c282264bf993b54d90b9f6",
        "class_hash": "0xabbea8e73f9e282fa460c36f5af8598994c6e365cbb0fe243bc1cdb283411d",
        "abi": [
          {
            "type": "impl",
            "name": "actions__ContractImpl",
            "interface_name": "dojo::contract::interface::IContract"
          },
          {
            "type": "interface",
            "name": "dojo::contract::interface::IContract",
            "items": []
          },
          {
            "type": "impl",
            "name": "actions__DeployedContractImpl",
            "interface_name": "dojo::meta::interface::IDeployedResource"
          },
          {
            "type": "struct",
            "name": "core::byte_array::ByteArray",
            "members": [
              {
                "name": "data",
                "type": "core::array::Array::<core::bytes_31::bytes31>"
              },
              {
                "name": "pending_word",
                "type": "core::felt252"
              },
              {
                "name": "pending_word_len",
                "type": "core::integer::u32"
              }
            ]
          },
          {
            "type": "interface",
            "name": "dojo::meta::interface::IDeployedResource",
            "items": [
              {
                "type": "function",
                "name": "dojo_name",
                "inputs": [],
                "outputs": [
                  {
                    "type": "core::byte_array::ByteArray"
                  }
                ],
                "state_mutability": "view"
              }
            ]
          },
          {
            "type": "impl",
            "name": "ActionsImpl",
            "interface_name": "pixelaw::core::actions::IActions"
          },
          {
            "type": "struct",
            "name": "pixelaw::core::models::pixel::Pixel",
            "members": [
              {
                "name": "x",
                "type": "core::integer::u16"
              },
              {
                "name": "y",
                "type": "core::integer::u16"
              },
              {
                "name": "app",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "color",
                "type": "core::integer::u32"
              },
              {
                "name": "created_at",
                "type": "core::integer::u64"
              },
              {
                "name": "updated_at",
                "type": "core::integer::u64"
              },
              {
                "name": "timestamp",
                "type": "core::integer::u64"
              },
              {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "text",
                "type": "core::felt252"
              },
              {
                "name": "action",
                "type": "core::felt252"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::integer::u32>",
            "variants": [
              {
                "name": "Some",
                "type": "core::integer::u32"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::starknet::contract_address::ContractAddress>",
            "variants": [
              {
                "name": "Some",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::felt252>",
            "variants": [
              {
                "name": "Some",
                "type": "core::felt252"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::integer::u64>",
            "variants": [
              {
                "name": "Some",
                "type": "core::integer::u64"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::models::pixel::PixelUpdate",
            "members": [
              {
                "name": "x",
                "type": "core::integer::u16"
              },
              {
                "name": "y",
                "type": "core::integer::u16"
              },
              {
                "name": "color",
                "type": "core::option::Option::<core::integer::u32>"
              },
              {
                "name": "owner",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
              },
              {
                "name": "app",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
              },
              {
                "name": "text",
                "type": "core::option::Option::<core::felt252>"
              },
              {
                "name": "timestamp",
                "type": "core::option::Option::<core::integer::u64>"
              },
              {
                "name": "action",
                "type": "core::option::Option::<core::felt252>"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::bool",
            "variants": [
              {
                "name": "False",
                "type": "()"
              },
              {
                "name": "True",
                "type": "()"
              }
            ]
          },
          {
            "type": "enum",
            "name": "pixelaw::core::models::pixel::PixelUpdateResult",
            "variants": [
              {
                "name": "Ok",
                "type": "pixelaw::core::models::pixel::PixelUpdate"
              },
              {
                "name": "NotAllowed",
                "type": "()"
              },
              {
                "name": "Error",
                "type": "core::felt252"
              }
            ]
          },
          {
            "type": "struct",
            "name": "core::array::Span::<core::felt252>",
            "members": [
              {
                "name": "snapshot",
                "type": "@core::array::Array::<core::felt252>"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::models::registry::App",
            "members": [
              {
                "name": "system",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "name",
                "type": "core::felt252"
              },
              {
                "name": "icon",
                "type": "core::felt252"
              },
              {
                "name": "action",
                "type": "core::felt252"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::utils::Position",
            "members": [
              {
                "name": "x",
                "type": "core::integer::u16"
              },
              {
                "name": "y",
                "type": "core::integer::u16"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::utils::Bounds",
            "members": [
              {
                "name": "x_min",
                "type": "core::integer::u16"
              },
              {
                "name": "y_min",
                "type": "core::integer::u16"
              },
              {
                "name": "x_max",
                "type": "core::integer::u16"
              },
              {
                "name": "y_max",
                "type": "core::integer::u16"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::models::area::Area",
            "members": [
              {
                "name": "id",
                "type": "core::integer::u64"
              },
              {
                "name": "app",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "color",
                "type": "core::integer::u32"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<pixelaw::core::models::area::Area>",
            "variants": [
              {
                "name": "Some",
                "type": "pixelaw::core::models::area::Area"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "struct",
            "name": "core::array::Span::<pixelaw::core::models::area::Area>",
            "members": [
              {
                "name": "snapshot",
                "type": "@core::array::Array::<pixelaw::core::models::area::Area>"
              }
            ]
          },
          {
            "type": "interface",
            "name": "pixelaw::core::actions::IActions",
            "items": [
              {
                "type": "function",
                "name": "init",
                "inputs": [],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "can_update_pixel",
                "inputs": [
                  {
                    "name": "for_player",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "for_system",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "pixel",
                    "type": "pixelaw::core::models::pixel::Pixel"
                  },
                  {
                    "name": "pixel_update",
                    "type": "pixelaw::core::models::pixel::PixelUpdate"
                  },
                  {
                    "name": "area_id_hint",
                    "type": "core::option::Option::<core::integer::u64>"
                  },
                  {
                    "name": "allow_modify",
                    "type": "core::bool"
                  }
                ],
                "outputs": [
                  {
                    "type": "pixelaw::core::models::pixel::PixelUpdateResult"
                  }
                ],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "update_pixel",
                "inputs": [
                  {
                    "name": "for_player",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "for_system",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "pixel_update",
                    "type": "pixelaw::core::models::pixel::PixelUpdate"
                  },
                  {
                    "name": "area_id",
                    "type": "core::option::Option::<core::integer::u64>"
                  },
                  {
                    "name": "allow_modify",
                    "type": "core::bool"
                  }
                ],
                "outputs": [
                  {
                    "type": "pixelaw::core::models::pixel::PixelUpdateResult"
                  }
                ],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "process_queue",
                "inputs": [
                  {
                    "name": "id",
                    "type": "core::felt252"
                  },
                  {
                    "name": "timestamp",
                    "type": "core::integer::u64"
                  },
                  {
                    "name": "called_system",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "selector",
                    "type": "core::felt252"
                  },
                  {
                    "name": "calldata",
                    "type": "core::array::Span::<core::felt252>"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "schedule_queue",
                "inputs": [
                  {
                    "name": "timestamp",
                    "type": "core::integer::u64"
                  },
                  {
                    "name": "called_system",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "selector",
                    "type": "core::felt252"
                  },
                  {
                    "name": "calldata",
                    "type": "core::array::Span::<core::felt252>"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "new_app",
                "inputs": [
                  {
                    "name": "system",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "name",
                    "type": "core::felt252"
                  },
                  {
                    "name": "icon",
                    "type": "core::felt252"
                  }
                ],
                "outputs": [
                  {
                    "type": "pixelaw::core::models::registry::App"
                  }
                ],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "alert_player",
                "inputs": [
                  {
                    "name": "position",
                    "type": "pixelaw::core::utils::Position"
                  },
                  {
                    "name": "player",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "message",
                    "type": "core::felt252"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "add_area",
                "inputs": [
                  {
                    "name": "bounds",
                    "type": "pixelaw::core::utils::Bounds"
                  },
                  {
                    "name": "owner",
                    "type": "core::starknet::contract_address::ContractAddress"
                  },
                  {
                    "name": "color",
                    "type": "core::integer::u32"
                  },
                  {
                    "name": "app",
                    "type": "core::starknet::contract_address::ContractAddress"
                  }
                ],
                "outputs": [
                  {
                    "type": "pixelaw::core::models::area::Area"
                  }
                ],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "remove_area",
                "inputs": [
                  {
                    "name": "area_id",
                    "type": "core::integer::u64"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "find_area_by_position",
                "inputs": [
                  {
                    "name": "position",
                    "type": "pixelaw::core::utils::Position"
                  }
                ],
                "outputs": [
                  {
                    "type": "core::option::Option::<pixelaw::core::models::area::Area>"
                  }
                ],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "find_areas_inside_bounds",
                "inputs": [
                  {
                    "name": "bounds",
                    "type": "pixelaw::core::utils::Bounds"
                  }
                ],
                "outputs": [
                  {
                    "type": "core::array::Span::<pixelaw::core::models::area::Area>"
                  }
                ],
                "state_mutability": "external"
              }
            ]
          },
          {
            "type": "function",
            "name": "dojo_init",
            "inputs": [],
            "outputs": [],
            "state_mutability": "view"
          },
          {
            "type": "impl",
            "name": "WorldProviderImpl",
            "interface_name": "dojo::contract::components::world_provider::IWorldProvider"
          },
          {
            "type": "struct",
            "name": "dojo::world::iworld::IWorldDispatcher",
            "members": [
              {
                "name": "contract_address",
                "type": "core::starknet::contract_address::ContractAddress"
              }
            ]
          },
          {
            "type": "interface",
            "name": "dojo::contract::components::world_provider::IWorldProvider",
            "items": [
              {
                "type": "function",
                "name": "world_dispatcher",
                "inputs": [],
                "outputs": [
                  {
                    "type": "dojo::world::iworld::IWorldDispatcher"
                  }
                ],
                "state_mutability": "view"
              }
            ]
          },
          {
            "type": "impl",
            "name": "UpgradeableImpl",
            "interface_name": "dojo::contract::components::upgradeable::IUpgradeable"
          },
          {
            "type": "interface",
            "name": "dojo::contract::components::upgradeable::IUpgradeable",
            "items": [
              {
                "type": "function",
                "name": "upgrade",
                "inputs": [
                  {
                    "name": "new_class_hash",
                    "type": "core::starknet::class_hash::ClassHash"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              }
            ]
          },
          {
            "type": "constructor",
            "name": "constructor",
            "inputs": []
          },
          {
            "type": "event",
            "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
            "kind": "struct",
            "members": [
              {
                "name": "class_hash",
                "type": "core::starknet::class_hash::ClassHash",
                "kind": "data"
              }
            ]
          },
          {
            "type": "event",
            "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
            "kind": "enum",
            "variants": [
              {
                "name": "Upgraded",
                "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
                "kind": "nested"
              }
            ]
          },
          {
            "type": "event",
            "name": "dojo::contract::components::world_provider::world_provider_cpt::Event",
            "kind": "enum",
            "variants": []
          },
          {
            "type": "event",
            "name": "pixelaw::core::actions::actions::Event",
            "kind": "enum",
            "variants": [
              {
                "name": "UpgradeableEvent",
                "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
                "kind": "nested"
              },
              {
                "name": "WorldProviderEvent",
                "type": "dojo::contract::components::world_provider::world_provider_cpt::Event",
                "kind": "nested"
              }
            ]
          }
        ],
        "init_calldata": [],
        "tag": "pixelaw-actions",
        "selector": "0x16928a49cfd8cf14e9f41e9d8f873890d1ab7d23b9a312d8a72f4031159876f",
        "systems": [
          "init",
          "can_update_pixel",
          "update_pixel",
          "process_queue",
          "schedule_queue",
          "new_app",
          "alert_player",
          "add_area",
          "remove_area",
          "find_area_by_position",
          "find_areas_inside_bounds",
          "upgrade"
        ]
      },
      {
        "address": "0x29a2c07e0bce2be8280a32b3027518bf87da1e36fa26ece96a9bb8889a36129",
        "class_hash": "0x21a2ccff36791e4791667895d760117b6f1cc81c521c471263c4bd2a26144ea",
        "abi": [
          {
            "type": "impl",
            "name": "paint_actions__ContractImpl",
            "interface_name": "dojo::contract::interface::IContract"
          },
          {
            "type": "interface",
            "name": "dojo::contract::interface::IContract",
            "items": []
          },
          {
            "type": "impl",
            "name": "paint_actions__DeployedContractImpl",
            "interface_name": "dojo::meta::interface::IDeployedResource"
          },
          {
            "type": "struct",
            "name": "core::byte_array::ByteArray",
            "members": [
              {
                "name": "data",
                "type": "core::array::Array::<core::bytes_31::bytes31>"
              },
              {
                "name": "pending_word",
                "type": "core::felt252"
              },
              {
                "name": "pending_word_len",
                "type": "core::integer::u32"
              }
            ]
          },
          {
            "type": "interface",
            "name": "dojo::meta::interface::IDeployedResource",
            "items": [
              {
                "type": "function",
                "name": "dojo_name",
                "inputs": [],
                "outputs": [
                  {
                    "type": "core::byte_array::ByteArray"
                  }
                ],
                "state_mutability": "view"
              }
            ]
          },
          {
            "type": "impl",
            "name": "Actions",
            "interface_name": "pixelaw::apps::paint::app::IPaintActions"
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::integer::u32>",
            "variants": [
              {
                "name": "Some",
                "type": "core::integer::u32"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::starknet::contract_address::ContractAddress>",
            "variants": [
              {
                "name": "Some",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::felt252>",
            "variants": [
              {
                "name": "Some",
                "type": "core::felt252"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::integer::u64>",
            "variants": [
              {
                "name": "Some",
                "type": "core::integer::u64"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::models::pixel::PixelUpdate",
            "members": [
              {
                "name": "x",
                "type": "core::integer::u16"
              },
              {
                "name": "y",
                "type": "core::integer::u16"
              },
              {
                "name": "color",
                "type": "core::option::Option::<core::integer::u32>"
              },
              {
                "name": "owner",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
              },
              {
                "name": "app",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
              },
              {
                "name": "text",
                "type": "core::option::Option::<core::felt252>"
              },
              {
                "name": "timestamp",
                "type": "core::option::Option::<core::integer::u64>"
              },
              {
                "name": "action",
                "type": "core::option::Option::<core::felt252>"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::models::registry::App",
            "members": [
              {
                "name": "system",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "name",
                "type": "core::felt252"
              },
              {
                "name": "icon",
                "type": "core::felt252"
              },
              {
                "name": "action",
                "type": "core::felt252"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<pixelaw::core::models::pixel::PixelUpdate>",
            "variants": [
              {
                "name": "Some",
                "type": "pixelaw::core::models::pixel::PixelUpdate"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::utils::Position",
            "members": [
              {
                "name": "x",
                "type": "core::integer::u16"
              },
              {
                "name": "y",
                "type": "core::integer::u16"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::utils::DefaultParameters",
            "members": [
              {
                "name": "player_override",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
              },
              {
                "name": "system_override",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
              },
              {
                "name": "area_hint",
                "type": "core::option::Option::<core::integer::u64>"
              },
              {
                "name": "position",
                "type": "pixelaw::core::utils::Position"
              },
              {
                "name": "color",
                "type": "core::integer::u32"
              }
            ]
          },
          {
            "type": "struct",
            "name": "core::array::Span::<core::felt252>",
            "members": [
              {
                "name": "snapshot",
                "type": "@core::array::Array::<core::felt252>"
              }
            ]
          },
          {
            "type": "interface",
            "name": "pixelaw::apps::paint::app::IPaintActions",
            "items": [
              {
                "type": "function",
                "name": "init",
                "inputs": [],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "on_pre_update",
                "inputs": [
                  {
                    "name": "pixel_update",
                    "type": "pixelaw::core::models::pixel::PixelUpdate"
                  },
                  {
                    "name": "app_caller",
                    "type": "pixelaw::core::models::registry::App"
                  },
                  {
                    "name": "player_caller",
                    "type": "core::starknet::contract_address::ContractAddress"
                  }
                ],
                "outputs": [
                  {
                    "type": "core::option::Option::<pixelaw::core::models::pixel::PixelUpdate>"
                  }
                ],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "on_post_update",
                "inputs": [
                  {
                    "name": "pixel_update",
                    "type": "pixelaw::core::models::pixel::PixelUpdate"
                  },
                  {
                    "name": "app_caller",
                    "type": "pixelaw::core::models::registry::App"
                  },
                  {
                    "name": "player_caller",
                    "type": "core::starknet::contract_address::ContractAddress"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "interact",
                "inputs": [
                  {
                    "name": "default_params",
                    "type": "pixelaw::core::utils::DefaultParameters"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "put_color",
                "inputs": [
                  {
                    "name": "default_params",
                    "type": "pixelaw::core::utils::DefaultParameters"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "fade",
                "inputs": [
                  {
                    "name": "default_params",
                    "type": "pixelaw::core::utils::DefaultParameters"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "pixel_row",
                "inputs": [
                  {
                    "name": "default_params",
                    "type": "pixelaw::core::utils::DefaultParameters"
                  },
                  {
                    "name": "image_data",
                    "type": "core::array::Span::<core::felt252>"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              }
            ]
          },
          {
            "type": "function",
            "name": "dojo_init",
            "inputs": [],
            "outputs": [],
            "state_mutability": "view"
          },
          {
            "type": "impl",
            "name": "WorldProviderImpl",
            "interface_name": "dojo::contract::components::world_provider::IWorldProvider"
          },
          {
            "type": "struct",
            "name": "dojo::world::iworld::IWorldDispatcher",
            "members": [
              {
                "name": "contract_address",
                "type": "core::starknet::contract_address::ContractAddress"
              }
            ]
          },
          {
            "type": "interface",
            "name": "dojo::contract::components::world_provider::IWorldProvider",
            "items": [
              {
                "type": "function",
                "name": "world_dispatcher",
                "inputs": [],
                "outputs": [
                  {
                    "type": "dojo::world::iworld::IWorldDispatcher"
                  }
                ],
                "state_mutability": "view"
              }
            ]
          },
          {
            "type": "impl",
            "name": "UpgradeableImpl",
            "interface_name": "dojo::contract::components::upgradeable::IUpgradeable"
          },
          {
            "type": "interface",
            "name": "dojo::contract::components::upgradeable::IUpgradeable",
            "items": [
              {
                "type": "function",
                "name": "upgrade",
                "inputs": [
                  {
                    "name": "new_class_hash",
                    "type": "core::starknet::class_hash::ClassHash"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              }
            ]
          },
          {
            "type": "constructor",
            "name": "constructor",
            "inputs": []
          },
          {
            "type": "event",
            "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
            "kind": "struct",
            "members": [
              {
                "name": "class_hash",
                "type": "core::starknet::class_hash::ClassHash",
                "kind": "data"
              }
            ]
          },
          {
            "type": "event",
            "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
            "kind": "enum",
            "variants": [
              {
                "name": "Upgraded",
                "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
                "kind": "nested"
              }
            ]
          },
          {
            "type": "event",
            "name": "dojo::contract::components::world_provider::world_provider_cpt::Event",
            "kind": "enum",
            "variants": []
          },
          {
            "type": "event",
            "name": "pixelaw::apps::paint::app::paint_actions::Event",
            "kind": "enum",
            "variants": [
              {
                "name": "UpgradeableEvent",
                "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
                "kind": "nested"
              },
              {
                "name": "WorldProviderEvent",
                "type": "dojo::contract::components::world_provider::world_provider_cpt::Event",
                "kind": "nested"
              }
            ]
          }
        ],
        "init_calldata": [],
        "tag": "pixelaw-paint_actions",
        "selector": "0x2afb94fee3f58a7234658d0fd5366da8a9c48a4978cc6fff464344d2720123d",
        "systems": [
          "init",
          "on_pre_update",
          "on_post_update",
          "interact",
          "put_color",
          "fade",
          "pixel_row",
          "upgrade"
        ]
      },
      {
        "address": "0x209c1d334f61b15bd57dab8cd4d765b0b4d4ce8800b339bb095e0e4ad71920f",
        "class_hash": "0x439245065fbcde3d0f13a3e462ce2cec94c9ab2519b16c296dbf1d243aea9ae",
        "abi": [
          {
            "type": "impl",
            "name": "snake_actions__ContractImpl",
            "interface_name": "dojo::contract::interface::IContract"
          },
          {
            "type": "interface",
            "name": "dojo::contract::interface::IContract",
            "items": []
          },
          {
            "type": "impl",
            "name": "snake_actions__DeployedContractImpl",
            "interface_name": "dojo::meta::interface::IDeployedResource"
          },
          {
            "type": "struct",
            "name": "core::byte_array::ByteArray",
            "members": [
              {
                "name": "data",
                "type": "core::array::Array::<core::bytes_31::bytes31>"
              },
              {
                "name": "pending_word",
                "type": "core::felt252"
              },
              {
                "name": "pending_word_len",
                "type": "core::integer::u32"
              }
            ]
          },
          {
            "type": "interface",
            "name": "dojo::meta::interface::IDeployedResource",
            "items": [
              {
                "type": "function",
                "name": "dojo_name",
                "inputs": [],
                "outputs": [
                  {
                    "type": "core::byte_array::ByteArray"
                  }
                ],
                "state_mutability": "view"
              }
            ]
          },
          {
            "type": "impl",
            "name": "ActionsImpl",
            "interface_name": "pixelaw::apps::snake::app::ISnakeActions"
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::starknet::contract_address::ContractAddress>",
            "variants": [
              {
                "name": "Some",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "enum",
            "name": "core::option::Option::<core::integer::u64>",
            "variants": [
              {
                "name": "Some",
                "type": "core::integer::u64"
              },
              {
                "name": "None",
                "type": "()"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::utils::Position",
            "members": [
              {
                "name": "x",
                "type": "core::integer::u16"
              },
              {
                "name": "y",
                "type": "core::integer::u16"
              }
            ]
          },
          {
            "type": "struct",
            "name": "pixelaw::core::utils::DefaultParameters",
            "members": [
              {
                "name": "player_override",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
              },
              {
                "name": "system_override",
                "type": "core::option::Option::<core::starknet::contract_address::ContractAddress>"
              },
              {
                "name": "area_hint",
                "type": "core::option::Option::<core::integer::u64>"
              },
              {
                "name": "position",
                "type": "pixelaw::core::utils::Position"
              },
              {
                "name": "color",
                "type": "core::integer::u32"
              }
            ]
          },
          {
            "type": "enum",
            "name": "pixelaw::core::utils::Direction",
            "variants": [
              {
                "name": "None",
                "type": "()"
              },
              {
                "name": "Left",
                "type": "()"
              },
              {
                "name": "Right",
                "type": "()"
              },
              {
                "name": "Up",
                "type": "()"
              },
              {
                "name": "Down",
                "type": "()"
              }
            ]
          },
          {
            "type": "interface",
            "name": "pixelaw::apps::snake::app::ISnakeActions",
            "items": [
              {
                "type": "function",
                "name": "init",
                "inputs": [],
                "outputs": [],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "interact",
                "inputs": [
                  {
                    "name": "default_params",
                    "type": "pixelaw::core::utils::DefaultParameters"
                  },
                  {
                    "name": "direction",
                    "type": "pixelaw::core::utils::Direction"
                  }
                ],
                "outputs": [
                  {
                    "type": "core::integer::u32"
                  }
                ],
                "state_mutability": "external"
              },
              {
                "type": "function",
                "name": "move",
                "inputs": [
                  {
                    "name": "owner",
                    "type": "core::starknet::contract_address::ContractAddress"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              }
            ]
          },
          {
            "type": "function",
            "name": "dojo_init",
            "inputs": [],
            "outputs": [],
            "state_mutability": "view"
          },
          {
            "type": "impl",
            "name": "WorldProviderImpl",
            "interface_name": "dojo::contract::components::world_provider::IWorldProvider"
          },
          {
            "type": "struct",
            "name": "dojo::world::iworld::IWorldDispatcher",
            "members": [
              {
                "name": "contract_address",
                "type": "core::starknet::contract_address::ContractAddress"
              }
            ]
          },
          {
            "type": "interface",
            "name": "dojo::contract::components::world_provider::IWorldProvider",
            "items": [
              {
                "type": "function",
                "name": "world_dispatcher",
                "inputs": [],
                "outputs": [
                  {
                    "type": "dojo::world::iworld::IWorldDispatcher"
                  }
                ],
                "state_mutability": "view"
              }
            ]
          },
          {
            "type": "impl",
            "name": "UpgradeableImpl",
            "interface_name": "dojo::contract::components::upgradeable::IUpgradeable"
          },
          {
            "type": "interface",
            "name": "dojo::contract::components::upgradeable::IUpgradeable",
            "items": [
              {
                "type": "function",
                "name": "upgrade",
                "inputs": [
                  {
                    "name": "new_class_hash",
                    "type": "core::starknet::class_hash::ClassHash"
                  }
                ],
                "outputs": [],
                "state_mutability": "external"
              }
            ]
          },
          {
            "type": "constructor",
            "name": "constructor",
            "inputs": []
          },
          {
            "type": "event",
            "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
            "kind": "struct",
            "members": [
              {
                "name": "class_hash",
                "type": "core::starknet::class_hash::ClassHash",
                "kind": "data"
              }
            ]
          },
          {
            "type": "event",
            "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
            "kind": "enum",
            "variants": [
              {
                "name": "Upgraded",
                "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
                "kind": "nested"
              }
            ]
          },
          {
            "type": "event",
            "name": "dojo::contract::components::world_provider::world_provider_cpt::Event",
            "kind": "enum",
            "variants": []
          },
          {
            "type": "event",
            "name": "pixelaw::apps::snake::app::snake_actions::Event",
            "kind": "enum",
            "variants": [
              {
                "name": "UpgradeableEvent",
                "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
                "kind": "nested"
              },
              {
                "name": "WorldProviderEvent",
                "type": "dojo::contract::components::world_provider::world_provider_cpt::Event",
                "kind": "nested"
              }
            ]
          }
        ],
        "init_calldata": [],
        "tag": "pixelaw-snake_actions",
        "selector": "0x4f96710669719291ad9660428d2dc9c921f129b75ddf0f70e8bf5837ea4157e",
        "systems": [
          "init",
          "interact",
          "move",
          "upgrade"
        ]
      }
    ],
    "models": [
      {
        "members": [],
        "class_hash": "0x4126d6e4961b0891df9f5647f81e0af4045bdb9a2872c22075c1bfc17b55f22",
        "tag": "pixelaw-App",
        "selector": "0x3650456503601ce448928ac87c54e3a6e95e76d725a59c95c7201324c9b2b74"
      },
      {
        "members": [],
        "class_hash": "0x2ba73deeca772ba3ea99c58ae9fc6631b0a1ef0e6530ca57e415697a3b70223",
        "tag": "pixelaw-AppName",
        "selector": "0x3b816829f5d924b5acc1c44d28b6b61b4edd94e62444c536b2bdc85c0e70a2a"
      },
      {
        "members": [],
        "class_hash": "0x1076206636fb7cb2929e09e6920c14f549108c858590f0799ad4424c77e361d",
        "tag": "pixelaw-AppUser",
        "selector": "0x4eda3c525958eca36164ba6f96e2b7591304838960197934ac8ae0a4b08b20f"
      },
      {
        "members": [],
        "class_hash": "0x3c0506cf801a4349d6232bde3c2c25e75d7c330ee9ae2da7969f9ff9c80e018",
        "tag": "pixelaw-Area",
        "selector": "0x41f22f1725b6e571bd66653e79fd700d80cc35c56f9dc5d663802e57478194"
      },
      {
        "members": [],
        "class_hash": "0x31ff6eee4b955a226958d02a083d47abdb898855259081b6c5b7b4cbe279481",
        "tag": "pixelaw-CoreActionsAddress",
        "selector": "0x5379e1ce3a70cb70f1e96dae1b142164574f33d4e32cebdb965b5aec30222c5"
      },
      {
        "members": [],
        "class_hash": "0x4bd730ead645bf5e5b5ff968ca8aa6fc7c67380b5c7059a50de52b48d433851",
        "tag": "pixelaw-Pixel",
        "selector": "0x7e607b2fbb4cfb3fb9d1258fa2ff3aa94f17b3820e42bf1e6a43e2de3f5772e"
      },
      {
        "members": [],
        "class_hash": "0x7c55eccc696dee3d0c42c81897b8ffab4e9d9b3645737e9660c5fad052b1510",
        "tag": "pixelaw-QueueItem",
        "selector": "0x549a17f23ab80595d9abd4d989a3d4bf0c1987ebc08ad48aecab0f1e8c311b4"
      },
      {
        "members": [],
        "class_hash": "0x2be7e4ac4e699fdf934d3bb4f155ab124e999e4077f1c9fbd664594c4e91db2",
        "tag": "pixelaw-RTree",
        "selector": "0x3baaf9fe25823e8928b6fc6400e28e98d4b7618ff56faf269a11f3400a1c105"
      },
      {
        "members": [],
        "class_hash": "0x4d26801f7bd975f48f95e2b23770d5360badc44f19b84cf8af8535d89c9627c",
        "tag": "pixelaw-Snake",
        "selector": "0x62b876d4cd94e88d2c363c3515ce2c9e8af1badad47a8dc96966543970658c1"
      },
      {
        "members": [],
        "class_hash": "0x63a30177d958faf98d3b6a13a99bb8bc178cbc6fb04c4ef5290dc8301cca00",
        "tag": "pixelaw-SnakeSegment",
        "selector": "0x302de0d87f8997cb65a4f7edb9a792706446961826bd4a16cbfb47fa09146ed"
      }
    ],
    "events": [
      {
        "members": [],
        "class_hash": "0x6a2206c941d303a072c00d112da416b3d0842d94d9fb31efd13749aaaa13da2",
        "tag": "pixelaw-Alert",
        "selector": "0x2a2938533e310a064aa2181f2cbb5914d80ac492be60f23fd358a49f47c26a2"
      },
      {
        "members": [],
        "class_hash": "0x9e4c29d3b299995b711b6be440f349ffcb8bba71bc41cd33c445aaf60aa746",
        "tag": "pixelaw-Died",
        "selector": "0x7d747e04206de964d63ff53216dcde822fd170b7c1d55ef7fc92dce1d6dbad8"
      },
      {
        "members": [],
        "class_hash": "0x3c8ceb8a7ff4aade3c14b66fa8ed2ba2403c087474c5fde88e79963bb3b6aab",
        "tag": "pixelaw-Moved",
        "selector": "0x2b409f0cebc7c8b0091267d7ed51567a6c0aae7147a86c07b854a1cc448aa28"
      },
      {
        "members": [],
        "class_hash": "0x5ec4f584c6d9fbbc46ce74bbb5a974734b59845d5107da7730005a6078603f2",
        "tag": "pixelaw-QueueProcessed",
        "selector": "0x6998c9cd795c72fd0cab90978a79bcdbe098723ec9a67e725a17104677743eb"
      },
      {
        "members": [],
        "class_hash": "0x285c23ee8661e296aca2a3eb8c6390c3735f151a7d5e5dff544f644ab363b00",
        "tag": "pixelaw-QueueScheduled",
        "selector": "0x32e74bc9762cc0dcdb6c7b67b35ded5b22a785e7c924673d6163369e6c6f769"
      }
    ]
  };
}

// src/utils/utils.ts
import { shortString } from "starknet";
async function getAbi(provider, app) {
  let name = felt252ToString(app.name).toLowerCase();
  const ch = await provider.getClassHashAt(app.system);
  const cl = await provider.getClass(ch);
  const tag = `pixelaw-${name}_actions`;
  name = `pixelaw::apps::${name}::app::${name}_actions`;
  return {
    kind: "DojoContract",
    address: app.system,
    abi: cl.abi,
    name,
    tag
  };
}
var felt252ToString = (felt252Input) => {
  let result = felt252Input;
  if (typeof result === "bigint" || typeof result === "object") {
    result = `0x${result.toString(16)}`;
  }
  if (result === "0x0" || result === "0") return "";
  if (typeof result === "string") {
    try {
      return shortString.decodeShortString(result).replace(/^\u0000+/, "");
    } catch (e) {
      return result;
    }
  }
  return result.toString();
};
var formatAddress = (address) => {
  if (address.length > 30) {
    return `${address.substr(0, 6)}...${address.substr(address.length - 4, address.length)}`;
  }
  return address;
};
var felt252ToUnicode = (felt252) => {
  const string = felt252ToString(felt252);
  if (string.includes("U+")) {
    const text = string.replace("U+", "");
    const codePoint = Number.parseInt(text, 16);
    return String.fromCodePoint(codePoint);
  }
  return string;
};

// src/DojoEngine.init.ts
var controllerConnectorCache = /* @__PURE__ */ new Map();
var burnerConnectorCache = /* @__PURE__ */ new Map();
async function dojoInit(worldConfig, schema2) {
  if (!worldConfig) {
    throw new Error("WorldConfig is not loaded");
  }
  const sdkSetup = {
    client: {
      rpcUrl: worldConfig.rpcUrl,
      toriiUrl: worldConfig.toriiUrl,
      relayUrl: "",
      worldAddress: worldConfig.world
    },
    domain: {
      name: "pixelaw",
      version: "1.0",
      chainId: "KATANA",
      revision: "1"
    }
  };
  const sdk = await init(sdkSetup, schema2);
  const { apps, manifest } = await fetchAppsAndManifest(worldConfig);
  const provider = new DojoProvider(manifest, worldConfig.rpcUrl);
  const controllerConnector = setupControllerConnector(manifest, worldConfig);
  const burnerConnector = await setupBurnerConnector(provider, worldConfig);
  return {
    sdk,
    controllerConnector,
    apps,
    manifest,
    burnerConnector,
    provider
  };
}
async function fetchAppsAndManifest(worldConfig) {
  try {
    const query = "SELECT internal_entity_id, name, system, action, icon FROM 'pixelaw-App';";
    const response = await fetch(`http://localhost:8080/sql?query=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const json = await response.json();
    const apps = json.map((item) => {
      return {
        name: felt252ToString(item.name),
        icon: felt252ToUnicode(item.icon),
        action: felt252ToString(item.action),
        system: item.system,
        entity: {
          id: item.internal_entity_id
        }
      };
    });
    const contracts = await Promise.all(
      apps.map((app) => getAbi(new RpcProvider({ nodeUrl: worldConfig.rpcUrl }), app))
    );
    const manifest = {
      ...manifest_default(worldConfig.world),
      contracts
    };
    return { apps, manifest };
  } catch (error) {
    console.error("Error fetching apps and manifest:", error);
    return { apps: [], manifest: {} };
  }
}
function setupControllerConnector(manifest, worldConfig) {
  if (!worldConfig.wallets.controller) {
    return null;
  }
  const cacheKey = JSON.stringify({ manifest, rpcUrl: worldConfig.wallets.controller?.rpcUrl });
  if (controllerConnectorCache.has(cacheKey)) {
    return controllerConnectorCache.get(cacheKey) || null;
  }
  const connector = worldConfig.wallets.controller ? getControllerConnector({
    feeTokenAddress: worldConfig.feeTokenAddress,
    manifest,
    rpcUrl: worldConfig.wallets.controller.rpcUrl
  }) : null;
  controllerConnectorCache.set(cacheKey, connector);
  return connector;
}
async function setupBurnerConnector(rpcProvider, worldConfig) {
  const cacheKey = JSON.stringify({ rpcProvider, burnerConfig: worldConfig.wallets?.burner });
  if (burnerConnectorCache.has(cacheKey)) {
    return burnerConnectorCache.get(cacheKey) || null;
  }
  const promise = (async () => {
    if (worldConfig.wallets?.burner) {
      const burnerConfig = worldConfig.wallets.burner;
      const manager = new BurnerManager({
        ...burnerConfig,
        feeTokenAddress: worldConfig.feeTokenAddress,
        rpcProvider: rpcProvider.provider,
        masterAccount: new Account(
          rpcProvider.provider,
          burnerConfig.masterAddress,
          burnerConfig.masterPrivateKey
        )
      });
      await manager.init();
      if (manager.list().length === 0) {
        try {
          await manager.create();
        } catch (e) {
          console.error(e);
        }
      }
      return new BurnerConnector(
        {
          id: "burner",
          name: `burner_${formatAddress(manager.account.address)}`
        },
        manager.account
      );
    }
    return null;
  })();
  burnerConnectorCache.set(cacheKey, promise);
  return promise;
}

// src/DojoInteraction.ts
var DojoInteraction = class {
  action;
  dialog = null;
};

// src/DojoSqlPixelStore.ts
import { MAX_DIMENSION as MAX_DIMENSION2 } from "@pixelaw/core";
import { areBoundsEqual, makeString } from "@pixelaw/core";
import mitt from "mitt";

// src/utils/querybuilder.ts
import { MAX_DIMENSION, QUERY_BUFFER } from "@pixelaw/core";
function getQueryBounds(viewBounds) {
  const [[left, top], [right, bottom]] = viewBounds;
  let l = 0;
  let t = 0;
  let r = 0;
  let b = 0;
  if (left < QUERY_BUFFER) {
    l = MAX_DIMENSION + 1 - QUERY_BUFFER;
  } else {
    l = left - left % QUERY_BUFFER;
  }
  if (top < QUERY_BUFFER) {
    t = MAX_DIMENSION + 1 - QUERY_BUFFER;
  } else {
    t = top - top % QUERY_BUFFER;
  }
  if (right > MAX_DIMENSION - QUERY_BUFFER + 1) {
    r = 0;
  } else {
    r = right + (QUERY_BUFFER - right % QUERY_BUFFER);
  }
  if (bottom > MAX_DIMENSION - QUERY_BUFFER + 1) {
    b = 0;
  } else {
    b = bottom + (QUERY_BUFFER - bottom % QUERY_BUFFER);
  }
  return [
    [l, t],
    [r, b]
  ];
}
var SUBSCRIPTION_QUERY = {
  pixelaw: {
    Pixel: {
      $: {
        where: {
          And: [
            { x: { $gte: 0 } },
            { y: { $gte: 0 } },
            { x: { $lte: MAX_DIMENSION } },
            { y: { $lte: MAX_DIMENSION } }
          ]
        }
      }
    }
  }
};

// src/DojoSqlPixelStore.ts
function createSqlQuery(bounds) {
  const [[left, top], [right, bottom]] = bounds;
  const xWraps = right - left < 0;
  const yWraps = bottom - top < 0;
  let result = `SELECT color as 'c', substr(text,  -4) as 't', (x << 16) | y AS v FROM "pixelaw-Pixel" WHERE( 1 = 0 ) `;
  const ZERO = 0;
  if (xWraps && yWraps) {
    result += ` OR(x >= ${left} AND y >= ${top} AND x <= ${MAX_DIMENSION2} AND y <= ${MAX_DIMENSION2} )`;
    result += ` OR(x >= ${left} AND y >= ${ZERO} AND x <= ${MAX_DIMENSION2} AND y <= ${bottom} )`;
    result += ` OR(x >= ${ZERO} AND y >= ${top} AND x <= ${right} AND y <= ${MAX_DIMENSION2} )`;
    result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`;
  } else if (xWraps) {
    result += ` OR(x >= ${left} AND y >= ${ZERO} AND x <= ${MAX_DIMENSION2} AND y <= ${bottom} )`;
    result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`;
  } else if (yWraps) {
    result += ` OR(x >= ${ZERO} AND y >= ${top} AND x <= ${right} AND y <= ${MAX_DIMENSION2} )`;
    result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`;
  } else {
    result += ` OR(x >= ${top} AND y >= ${top} AND x <= ${right} AND y <= ${bottom} )`;
  }
  result += ";";
  return result;
}
var DojoSqlPixelStore = class _DojoSqlPixelStore {
  eventEmitter = mitt();
  static instance;
  state = {};
  queryBounds = null;
  cacheUpdated = Date.now();
  isSubscribed = false;
  sdk;
  worker;
  constructor(sdk) {
    this.sdk = sdk;
    const workerUrl = new URL("./DojoSqlPixelStore.webworker.js", import.meta.url);
    this.worker = new Worker(workerUrl, { type: "module" });
    this.worker.onmessage = this.handleRefreshWorker.bind(this);
    this.subscribe();
  }
  static getInstance(sdk) {
    if (!_DojoSqlPixelStore.instance) {
      _DojoSqlPixelStore.instance = new _DojoSqlPixelStore(sdk);
    }
    return _DojoSqlPixelStore.instance;
  }
  async subscribe() {
    if (this.isSubscribed) return;
    try {
      const subscription = await this.sdk.subscribeEntityQuery({
        // @ts-ignore TODO fix the type of query
        query: SUBSCRIPTION_QUERY,
        callback: (response) => {
          if (response.error) {
            console.error("Error setting up entity sync:", response.error);
          } else if (response.data && response.data[0].entityId !== "0x0") {
            const p = response.data[0].models.pixelaw.Pixel;
            const key = `${p?.x}_${p?.y}`;
            this.setPixel(key, p);
          }
          this.cacheUpdated = Date.now();
        }
      });
      this.isSubscribed = true;
      return () => {
        subscription.cancel();
        this.isSubscribed = false;
      };
    } catch (error) {
      console.error("Subscription error:", error);
    }
  }
  handleRefreshWorker(event) {
    const { success, data, error } = event.data;
    if (success) {
      this.state = { ...this.state, ...data };
      this.eventEmitter.emit("cacheUpdated", Date.now());
      console.log("pixels in cache: ", Object.keys(this.state).length);
    } else {
      console.error("RefreshWorker error:", error);
    }
  }
  refresh() {
    console.log(JSON.stringify(this.queryBounds));
    if (!this.queryBounds) return;
    const q = createSqlQuery(this.queryBounds);
    const query = encodeURIComponent(q);
    this.worker.postMessage({ query });
  }
  prepare(newBounds) {
    const newQueryBounds = getQueryBounds(newBounds);
    if (!this.queryBounds || !areBoundsEqual(this.queryBounds, newQueryBounds)) {
      this.queryBounds = newQueryBounds;
    }
  }
  getPixel(coord) {
    const key = `${coord[0]}_${coord[1]}`;
    return this.state[key];
  }
  setPixel(key, pixel) {
    this.state[key] = pixel;
  }
  setPixelColor(coord, color) {
    const key = makeString(coord);
    let pixel = this.state[key];
    if (!pixel) {
      pixel = {
        action: "",
        color,
        owner: "",
        text: "",
        timestamp: Date.now(),
        x: coord[0],
        y: coord[1]
      };
    } else {
      pixel = {
        ...pixel,
        color
      };
    }
    this.setPixel(key, pixel);
  }
  setPixels(pixels) {
    for (const { key, pixel } of pixels) {
      this.setPixel(key, pixel);
    }
  }
  updateCache() {
  }
  setCacheUpdated(value) {
    this.cacheUpdated = value;
  }
  getCacheUpdated() {
    return this.cacheUpdated;
  }
};
var DojoSqlPixelStore_default = DojoSqlPixelStore;

// src/generated/models.gen.ts
var schema = {
  pixelaw: {
    App: {
      fieldOrder: ["system", "name", "icon", "action"],
      system: "",
      name: 0,
      icon: 0,
      action: 0
    },
    AppValue: {
      fieldOrder: ["name", "icon", "action"],
      name: 0,
      icon: 0,
      action: 0
    },
    AppName: {
      fieldOrder: ["name", "system"],
      name: 0,
      system: ""
    },
    AppNameValue: {
      fieldOrder: ["system"],
      system: ""
    },
    AppUser: {
      fieldOrder: ["system", "player", "action"],
      system: "",
      player: "",
      action: 0
    },
    AppUserValue: {
      fieldOrder: ["action"],
      action: 0
    },
    AreaValue: {
      fieldOrder: ["app", "owner", "color"],
      app: "",
      owner: "",
      color: 0
    },
    Area: {
      fieldOrder: ["id", "app", "owner", "color"],
      id: 0,
      app: "",
      owner: "",
      color: 0
    },
    CoreActionsAddress: {
      fieldOrder: ["key", "value"],
      key: 0,
      value: ""
    },
    CoreActionsAddressValue: {
      fieldOrder: ["value"],
      value: ""
    },
    Pixel: {
      fieldOrder: ["x", "y", "app", "color", "created_at", "updated_at", "timestamp", "owner", "text", "action"],
      x: 0,
      y: 0,
      app: "",
      color: 0,
      created_at: 0,
      updated_at: 0,
      timestamp: 0,
      owner: "",
      text: 0,
      action: 0
    },
    PixelValue: {
      fieldOrder: ["app", "color", "created_at", "updated_at", "timestamp", "owner", "text", "action"],
      app: "",
      color: 0,
      created_at: 0,
      updated_at: 0,
      timestamp: 0,
      owner: "",
      text: 0,
      action: 0
    },
    QueueItem: {
      fieldOrder: ["id", "valid"],
      id: 0,
      valid: false
    },
    QueueItemValue: {
      fieldOrder: ["valid"],
      valid: false
    },
    RTree: {
      fieldOrder: ["id", "children"],
      id: 0,
      children: 0
    },
    RTreeValue: {
      fieldOrder: ["children"],
      children: 0
    },
    Snake: {
      fieldOrder: ["owner", "length", "first_segment_id", "last_segment_id", "direction", "color", "text", "is_dying"],
      owner: "",
      length: 0,
      first_segment_id: 0,
      last_segment_id: 0,
      direction: 0 /* None */,
      color: 0,
      text: 0,
      is_dying: false
    },
    SnakeValue: {
      fieldOrder: ["length", "first_segment_id", "last_segment_id", "direction", "color", "text", "is_dying"],
      length: 0,
      first_segment_id: 0,
      last_segment_id: 0,
      direction: 0 /* None */,
      color: 0,
      text: 0,
      is_dying: false
    },
    SnakeSegmentValue: {
      fieldOrder: ["previous_id", "next_id", "x", "y", "pixel_original_color", "pixel_original_text", "pixel_original_app"],
      previous_id: 0,
      next_id: 0,
      x: 0,
      y: 0,
      pixel_original_color: 0,
      pixel_original_text: 0,
      pixel_original_app: ""
    },
    SnakeSegment: {
      fieldOrder: ["id", "previous_id", "next_id", "x", "y", "pixel_original_color", "pixel_original_text", "pixel_original_app"],
      id: 0,
      previous_id: 0,
      next_id: 0,
      x: 0,
      y: 0,
      pixel_original_color: 0,
      pixel_original_text: 0,
      pixel_original_app: ""
    }
  }
};

// src/utils/paramsDef.ts
import { getContractByName } from "@dojoengine/core";
import { NAMESPACE } from "@pixelaw/core";
var DEFAULT_PARAMETERS_TYPE = "pixelaw::core::utils::DefaultParameters";
var convertSnakeToPascal = (snakeCaseString) => {
  return snakeCaseString.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
};
function generateDojoCall(manifest, params, contractName, action, position, color) {
  const contract = getContractByName(manifest, NAMESPACE, contractName);
  const player_override = 1;
  const system_override = 1;
  const area_hint = 1;
  const position_x = position.x;
  const position_y = position.y;
  const calldata = [player_override, system_override, area_hint, position_x, position_y, color];
  for (const param of params) {
    if (param.value) {
      calldata.push(param.value);
    }
  }
  return {
    contractAddress: contract.address,
    entrypoint: action,
    calldata
  };
}
function getParamsDef(manifest, contractName, methodName, strict) {
  const interfaceName = `I${convertSnakeToPascal(contractName)}`;
  const contract = manifest.contracts.find((c) => c.name.includes(contractName));
  if (!contract) return [];
  const abi = contract?.abi;
  const methods = abi.find((x) => x.type === "interface" && x.name.includes(interfaceName));
  if (!methods) {
    if (strict) throw new Error(`unknown interface: ${interfaceName}`);
    return [];
  }
  if (!methods?.items) {
    if (strict) throw new Error(`no methods for interface: ${interfaceName}`);
    return [];
  }
  let functionDef = methods.items.find((method) => method.name === methodName && method.type === "function");
  if (!functionDef) {
    functionDef = methods.items.find((method) => method.name === "interact" && method.type === "function");
    if (!functionDef) {
      if (strict) throw new Error(`function ${methodName} not found`);
      return [];
    }
  }
  const parameters = [];
  for (const input of functionDef.inputs) {
    if (input.type !== DEFAULT_PARAMETERS_TYPE) {
      parameters.push(input);
    }
  }
  const result = [];
  for (const param of parameters) {
    const isPrimitiveType = param.type.includes("core::integer") || param.type.includes("core::felt252");
    let type = "number";
    const variants = [];
    const transformer = void 0;
    if (!isPrimitiveType) {
      const typeDefinition = abi.find((x) => x.name === param.type);
      if (typeDefinition?.type === "enum") {
        for (const index in typeDefinition.variants) {
          const variant = typeDefinition.variants[index];
          if (variant.name !== "None") {
            variants.push({
              name: variant.name,
              value: Number.parseInt(index)
            });
          }
        }
        type = "enum";
      }
    } else if (param.type.includes("core::felt252")) {
      type = "string";
    }
    result.push({
      name: param.name,
      type,
      variants,
      transformer,
      value: void 0
    });
  }
  return result;
}

// src/DojoAppStore.ts
var DojoAppStore = class {
  dojoStuff;
  // TODO handle updated apps
  constructor(dojoStuff) {
    this.dojoStuff = dojoStuff;
  }
  getAll() {
    return this.dojoStuff.apps;
  }
  getByName(name) {
    return this.dojoStuff.apps.find((app) => app.name === name);
  }
};

// src/DojoEngine.ts
var DojoEngine = class {
  pixelStore = null;
  tileStore = null;
  appStore = null;
  updateService = null;
  status = "uninitialized";
  config = null;
  dojoSetup = null;
  account = null;
  async init(config) {
    this.config = config;
    try {
      this.dojoSetup = await dojoInit(this.config, schema);
      this.status = this.dojoSetup ? "ready" : "error";
      this.appStore = new DojoAppStore(this.dojoSetup);
      this.pixelStore = new DojoSqlPixelStore_default(this.dojoSetup.sdk);
      this.updateService = new WsUpdateService(config.serverUrl);
      this.tileStore = new RestTileStore(config.serverUrl);
    } catch (error) {
      console.error("Dojo init error:", error);
    }
  }
  handleInteraction(app, pixel, color) {
    const result = new DojoInteraction();
    if (!app) return result;
    if (!app.plugin) {
      const pixelAction = pixel?.action ? pixel.action : "interact";
      const contractName = `${app.name}_actions`;
      const position = { x: pixel.x, y: pixel.y };
      const params = getParamsDef(this.dojoSetup.manifest, contractName, pixelAction, false);
      const action = (params2) => {
        console.log("params", params2);
        const dojoCall = generateDojoCall(
          this.dojoSetup.manifest,
          params2,
          contractName,
          pixelAction,
          position,
          color
        );
        this.dojoSetup.provider.execute(this.account, dojoCall, NAMESPACE2, {}).then((res) => {
          console.log("dojocall after exec", res);
        }).catch((error) => {
          console.error("Error executing DojoCall:", error);
        });
      };
      if (params.length) {
        result.dialog = createDialog(action, params);
        result.action = action;
      } else {
        action(params);
      }
    } else {
    }
    return result;
  }
  async setWallet(wallet) {
  }
};
export {
  DojoEngine
};
