// abi's for dojo 1.2.1
// models for pixelaw 0.6.13

export function baseManifest(worldAddress: string) {
	return {
		world: {
			class_hash:
				"0x7c9469d45a9cdbab775035afb48e1fa73fb35ab059fcb9dfb0a301aa973e783",
			address: worldAddress,
			seed: "pixelaw",
			name: "pixelaw",
			entrypoints: [
				"uuid",
				"set_metadata",
				"register_namespace",
				"register_event",
				"register_model",
				"register_contract",
				"register_library",
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
				"upgrade",
			],
			abi: [
				{
					type: "impl",
					name: "World",
					interface_name: "dojo::world::iworld::IWorld",
				},
				{
					type: "struct",
					name: "core::byte_array::ByteArray",
					members: [
						{
							name: "data",
							type: "core::array::Array::<core::bytes_31::bytes31>",
						},
						{
							name: "pending_word",
							type: "core::felt252",
						},
						{
							name: "pending_word_len",
							type: "core::integer::u32",
						},
					],
				},
				{
					type: "enum",
					name: "dojo::world::resource::Resource",
					variants: [
						{
							name: "Model",
							type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
						},
						{
							name: "Event",
							type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
						},
						{
							name: "Contract",
							type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
						},
						{
							name: "Namespace",
							type: "core::byte_array::ByteArray",
						},
						{
							name: "World",
							type: "()",
						},
						{
							name: "Unregistered",
							type: "()",
						},
						{
							name: "Library",
							type: "(core::starknet::class_hash::ClassHash, core::felt252)",
						},
					],
				},
				{
					type: "struct",
					name: "dojo::model::metadata::ResourceMetadata",
					members: [
						{
							name: "resource_id",
							type: "core::felt252",
						},
						{
							name: "metadata_uri",
							type: "core::byte_array::ByteArray",
						},
						{
							name: "metadata_hash",
							type: "core::felt252",
						},
					],
				},
				{
					type: "struct",
					name: "core::array::Span::<core::felt252>",
					members: [
						{
							name: "snapshot",
							type: "@core::array::Array::<core::felt252>",
						},
					],
				},
				{
					type: "struct",
					name: "core::array::Span::<core::array::Span::<core::felt252>>",
					members: [
						{
							name: "snapshot",
							type: "@core::array::Array::<core::array::Span::<core::felt252>>",
						},
					],
				},
				{
					type: "enum",
					name: "dojo::model::definition::ModelIndex",
					variants: [
						{
							name: "Keys",
							type: "core::array::Span::<core::felt252>",
						},
						{
							name: "Id",
							type: "core::felt252",
						},
						{
							name: "MemberId",
							type: "(core::felt252, core::felt252)",
						},
					],
				},
				{
					type: "struct",
					name: "core::array::Span::<core::integer::u8>",
					members: [
						{
							name: "snapshot",
							type: "@core::array::Array::<core::integer::u8>",
						},
					],
				},
				{
					type: "struct",
					name: "dojo::meta::layout::FieldLayout",
					members: [
						{
							name: "selector",
							type: "core::felt252",
						},
						{
							name: "layout",
							type: "dojo::meta::layout::Layout",
						},
					],
				},
				{
					type: "struct",
					name: "core::array::Span::<dojo::meta::layout::FieldLayout>",
					members: [
						{
							name: "snapshot",
							type: "@core::array::Array::<dojo::meta::layout::FieldLayout>",
						},
					],
				},
				{
					type: "struct",
					name: "core::array::Span::<dojo::meta::layout::Layout>",
					members: [
						{
							name: "snapshot",
							type: "@core::array::Array::<dojo::meta::layout::Layout>",
						},
					],
				},
				{
					type: "enum",
					name: "dojo::meta::layout::Layout",
					variants: [
						{
							name: "Fixed",
							type: "core::array::Span::<core::integer::u8>",
						},
						{
							name: "Struct",
							type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
						},
						{
							name: "Tuple",
							type: "core::array::Span::<dojo::meta::layout::Layout>",
						},
						{
							name: "Array",
							type: "core::array::Span::<dojo::meta::layout::Layout>",
						},
						{
							name: "ByteArray",
							type: "()",
						},
						{
							name: "Enum",
							type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
						},
					],
				},
				{
					type: "struct",
					name: "core::array::Span::<dojo::model::definition::ModelIndex>",
					members: [
						{
							name: "snapshot",
							type: "@core::array::Array::<dojo::model::definition::ModelIndex>",
						},
					],
				},
				{
					type: "enum",
					name: "core::bool",
					variants: [
						{
							name: "False",
							type: "()",
						},
						{
							name: "True",
							type: "()",
						},
					],
				},
				{
					type: "interface",
					name: "dojo::world::iworld::IWorld",
					items: [
						{
							type: "function",
							name: "resource",
							inputs: [
								{
									name: "selector",
									type: "core::felt252",
								},
							],
							outputs: [
								{
									type: "dojo::world::resource::Resource",
								},
							],
							state_mutability: "view",
						},
						{
							type: "function",
							name: "uuid",
							inputs: [],
							outputs: [
								{
									type: "core::integer::u32",
								},
							],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "metadata",
							inputs: [
								{
									name: "resource_selector",
									type: "core::felt252",
								},
							],
							outputs: [
								{
									type: "dojo::model::metadata::ResourceMetadata",
								},
							],
							state_mutability: "view",
						},
						{
							type: "function",
							name: "set_metadata",
							inputs: [
								{
									name: "metadata",
									type: "dojo::model::metadata::ResourceMetadata",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "register_namespace",
							inputs: [
								{
									name: "namespace",
									type: "core::byte_array::ByteArray",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "register_event",
							inputs: [
								{
									name: "namespace",
									type: "core::byte_array::ByteArray",
								},
								{
									name: "class_hash",
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "register_model",
							inputs: [
								{
									name: "namespace",
									type: "core::byte_array::ByteArray",
								},
								{
									name: "class_hash",
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "register_contract",
							inputs: [
								{
									name: "salt",
									type: "core::felt252",
								},
								{
									name: "namespace",
									type: "core::byte_array::ByteArray",
								},
								{
									name: "class_hash",
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							outputs: [
								{
									type: "core::starknet::contract_address::ContractAddress",
								},
							],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "register_library",
							inputs: [
								{
									name: "namespace",
									type: "core::byte_array::ByteArray",
								},
								{
									name: "class_hash",
									type: "core::starknet::class_hash::ClassHash",
								},
								{
									name: "name",
									type: "core::byte_array::ByteArray",
								},
								{
									name: "version",
									type: "core::byte_array::ByteArray",
								},
							],
							outputs: [
								{
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "init_contract",
							inputs: [
								{
									name: "selector",
									type: "core::felt252",
								},
								{
									name: "init_calldata",
									type: "core::array::Span::<core::felt252>",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "upgrade_event",
							inputs: [
								{
									name: "namespace",
									type: "core::byte_array::ByteArray",
								},
								{
									name: "class_hash",
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "upgrade_model",
							inputs: [
								{
									name: "namespace",
									type: "core::byte_array::ByteArray",
								},
								{
									name: "class_hash",
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "upgrade_contract",
							inputs: [
								{
									name: "namespace",
									type: "core::byte_array::ByteArray",
								},
								{
									name: "class_hash",
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							outputs: [
								{
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "emit_event",
							inputs: [
								{
									name: "event_selector",
									type: "core::felt252",
								},
								{
									name: "keys",
									type: "core::array::Span::<core::felt252>",
								},
								{
									name: "values",
									type: "core::array::Span::<core::felt252>",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "emit_events",
							inputs: [
								{
									name: "event_selector",
									type: "core::felt252",
								},
								{
									name: "keys",
									type: "core::array::Span::<core::array::Span::<core::felt252>>",
								},
								{
									name: "values",
									type: "core::array::Span::<core::array::Span::<core::felt252>>",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "entity",
							inputs: [
								{
									name: "model_selector",
									type: "core::felt252",
								},
								{
									name: "index",
									type: "dojo::model::definition::ModelIndex",
								},
								{
									name: "layout",
									type: "dojo::meta::layout::Layout",
								},
							],
							outputs: [
								{
									type: "core::array::Span::<core::felt252>",
								},
							],
							state_mutability: "view",
						},
						{
							type: "function",
							name: "entities",
							inputs: [
								{
									name: "model_selector",
									type: "core::felt252",
								},
								{
									name: "indexes",
									type: "core::array::Span::<dojo::model::definition::ModelIndex>",
								},
								{
									name: "layout",
									type: "dojo::meta::layout::Layout",
								},
							],
							outputs: [
								{
									type: "core::array::Span::<core::array::Span::<core::felt252>>",
								},
							],
							state_mutability: "view",
						},
						{
							type: "function",
							name: "set_entity",
							inputs: [
								{
									name: "model_selector",
									type: "core::felt252",
								},
								{
									name: "index",
									type: "dojo::model::definition::ModelIndex",
								},
								{
									name: "values",
									type: "core::array::Span::<core::felt252>",
								},
								{
									name: "layout",
									type: "dojo::meta::layout::Layout",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "set_entities",
							inputs: [
								{
									name: "model_selector",
									type: "core::felt252",
								},
								{
									name: "indexes",
									type: "core::array::Span::<dojo::model::definition::ModelIndex>",
								},
								{
									name: "values",
									type: "core::array::Span::<core::array::Span::<core::felt252>>",
								},
								{
									name: "layout",
									type: "dojo::meta::layout::Layout",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "delete_entity",
							inputs: [
								{
									name: "model_selector",
									type: "core::felt252",
								},
								{
									name: "index",
									type: "dojo::model::definition::ModelIndex",
								},
								{
									name: "layout",
									type: "dojo::meta::layout::Layout",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "delete_entities",
							inputs: [
								{
									name: "model_selector",
									type: "core::felt252",
								},
								{
									name: "indexes",
									type: "core::array::Span::<dojo::model::definition::ModelIndex>",
								},
								{
									name: "layout",
									type: "dojo::meta::layout::Layout",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "is_owner",
							inputs: [
								{
									name: "resource",
									type: "core::felt252",
								},
								{
									name: "address",
									type: "core::starknet::contract_address::ContractAddress",
								},
							],
							outputs: [
								{
									type: "core::bool",
								},
							],
							state_mutability: "view",
						},
						{
							type: "function",
							name: "grant_owner",
							inputs: [
								{
									name: "resource",
									type: "core::felt252",
								},
								{
									name: "address",
									type: "core::starknet::contract_address::ContractAddress",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "revoke_owner",
							inputs: [
								{
									name: "resource",
									type: "core::felt252",
								},
								{
									name: "address",
									type: "core::starknet::contract_address::ContractAddress",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "is_writer",
							inputs: [
								{
									name: "resource",
									type: "core::felt252",
								},
								{
									name: "contract",
									type: "core::starknet::contract_address::ContractAddress",
								},
							],
							outputs: [
								{
									type: "core::bool",
								},
							],
							state_mutability: "view",
						},
						{
							type: "function",
							name: "grant_writer",
							inputs: [
								{
									name: "resource",
									type: "core::felt252",
								},
								{
									name: "contract",
									type: "core::starknet::contract_address::ContractAddress",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
						{
							type: "function",
							name: "revoke_writer",
							inputs: [
								{
									name: "resource",
									type: "core::felt252",
								},
								{
									name: "contract",
									type: "core::starknet::contract_address::ContractAddress",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
					],
				},
				{
					type: "impl",
					name: "UpgradeableWorld",
					interface_name: "dojo::world::iworld::IUpgradeableWorld",
				},
				{
					type: "interface",
					name: "dojo::world::iworld::IUpgradeableWorld",
					items: [
						{
							type: "function",
							name: "upgrade",
							inputs: [
								{
									name: "new_class_hash",
									type: "core::starknet::class_hash::ClassHash",
								},
							],
							outputs: [],
							state_mutability: "external",
						},
					],
				},
				{
					type: "constructor",
					name: "constructor",
					inputs: [
						{
							name: "world_class_hash",
							type: "core::starknet::class_hash::ClassHash",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::WorldSpawned",
					kind: "struct",
					members: [
						{
							name: "creator",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "data",
						},
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::WorldUpgraded",
					kind: "struct",
					members: [
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::NamespaceRegistered",
					kind: "struct",
					members: [
						{
							name: "namespace",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "hash",
							type: "core::felt252",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::ModelRegistered",
					kind: "struct",
					members: [
						{
							name: "name",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "namespace",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
						{
							name: "address",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::EventRegistered",
					kind: "struct",
					members: [
						{
							name: "name",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "namespace",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
						{
							name: "address",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::ContractRegistered",
					kind: "struct",
					members: [
						{
							name: "name",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "namespace",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "address",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "data",
						},
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
						{
							name: "salt",
							type: "core::felt252",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::ModelUpgraded",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
						{
							name: "address",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "data",
						},
						{
							name: "prev_address",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::EventUpgraded",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
						{
							name: "address",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "data",
						},
						{
							name: "prev_address",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::ContractUpgraded",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::ContractInitialized",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "init_calldata",
							type: "core::array::Span::<core::felt252>",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::LibraryRegistered",
					kind: "struct",
					members: [
						{
							name: "name",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "namespace",
							type: "core::byte_array::ByteArray",
							kind: "key",
						},
						{
							name: "class_hash",
							type: "core::starknet::class_hash::ClassHash",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::EventEmitted",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "system_address",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "key",
						},
						{
							name: "keys",
							type: "core::array::Span::<core::felt252>",
							kind: "data",
						},
						{
							name: "values",
							type: "core::array::Span::<core::felt252>",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::MetadataUpdate",
					kind: "struct",
					members: [
						{
							name: "resource",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "uri",
							type: "core::byte_array::ByteArray",
							kind: "data",
						},
						{
							name: "hash",
							type: "core::felt252",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::StoreSetRecord",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "entity_id",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "keys",
							type: "core::array::Span::<core::felt252>",
							kind: "data",
						},
						{
							name: "values",
							type: "core::array::Span::<core::felt252>",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::StoreUpdateRecord",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "entity_id",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "values",
							type: "core::array::Span::<core::felt252>",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::StoreUpdateMember",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "entity_id",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "member_selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "values",
							type: "core::array::Span::<core::felt252>",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::StoreDelRecord",
					kind: "struct",
					members: [
						{
							name: "selector",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "entity_id",
							type: "core::felt252",
							kind: "key",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::WriterUpdated",
					kind: "struct",
					members: [
						{
							name: "resource",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "contract",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "key",
						},
						{
							name: "value",
							type: "core::bool",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::OwnerUpdated",
					kind: "struct",
					members: [
						{
							name: "resource",
							type: "core::felt252",
							kind: "key",
						},
						{
							name: "contract",
							type: "core::starknet::contract_address::ContractAddress",
							kind: "key",
						},
						{
							name: "value",
							type: "core::bool",
							kind: "data",
						},
					],
				},
				{
					type: "event",
					name: "dojo::world::world_contract::world::Event",
					kind: "enum",
					variants: [
						{
							name: "WorldSpawned",
							type: "dojo::world::world_contract::world::WorldSpawned",
							kind: "nested",
						},
						{
							name: "WorldUpgraded",
							type: "dojo::world::world_contract::world::WorldUpgraded",
							kind: "nested",
						},
						{
							name: "NamespaceRegistered",
							type: "dojo::world::world_contract::world::NamespaceRegistered",
							kind: "nested",
						},
						{
							name: "ModelRegistered",
							type: "dojo::world::world_contract::world::ModelRegistered",
							kind: "nested",
						},
						{
							name: "EventRegistered",
							type: "dojo::world::world_contract::world::EventRegistered",
							kind: "nested",
						},
						{
							name: "ContractRegistered",
							type: "dojo::world::world_contract::world::ContractRegistered",
							kind: "nested",
						},
						{
							name: "ModelUpgraded",
							type: "dojo::world::world_contract::world::ModelUpgraded",
							kind: "nested",
						},
						{
							name: "EventUpgraded",
							type: "dojo::world::world_contract::world::EventUpgraded",
							kind: "nested",
						},
						{
							name: "ContractUpgraded",
							type: "dojo::world::world_contract::world::ContractUpgraded",
							kind: "nested",
						},
						{
							name: "ContractInitialized",
							type: "dojo::world::world_contract::world::ContractInitialized",
							kind: "nested",
						},
						{
							name: "LibraryRegistered",
							type: "dojo::world::world_contract::world::LibraryRegistered",
							kind: "nested",
						},
						{
							name: "EventEmitted",
							type: "dojo::world::world_contract::world::EventEmitted",
							kind: "nested",
						},
						{
							name: "MetadataUpdate",
							type: "dojo::world::world_contract::world::MetadataUpdate",
							kind: "nested",
						},
						{
							name: "StoreSetRecord",
							type: "dojo::world::world_contract::world::StoreSetRecord",
							kind: "nested",
						},
						{
							name: "StoreUpdateRecord",
							type: "dojo::world::world_contract::world::StoreUpdateRecord",
							kind: "nested",
						},
						{
							name: "StoreUpdateMember",
							type: "dojo::world::world_contract::world::StoreUpdateMember",
							kind: "nested",
						},
						{
							name: "StoreDelRecord",
							type: "dojo::world::world_contract::world::StoreDelRecord",
							kind: "nested",
						},
						{
							name: "WriterUpdated",
							type: "dojo::world::world_contract::world::WriterUpdated",
							kind: "nested",
						},
						{
							name: "OwnerUpdated",
							type: "dojo::world::world_contract::world::OwnerUpdated",
							kind: "nested",
						},
					],
				},
			],
		},
		contracts: [
			{
				address:
					"0x5abe5e7947471f74a79d169091544f5caf38a24d1f66ed3c6ca3a0020ddcdde",
				class_hash:
					"0x7668748f956d655d8f692126757b891e194be5abda7fb1742ad207339b3ab33",
				abi: [
					{
						type: "impl",
						name: "actions__ContractImpl",
						interface_name: "dojo::contract::interface::IContract",
					},
					{
						type: "interface",
						name: "dojo::contract::interface::IContract",
						items: [],
					},
					{
						type: "impl",
						name: "actions__DeployedContractImpl",
						interface_name: "dojo::meta::interface::IDeployedResource",
					},
					{
						type: "struct",
						name: "core::byte_array::ByteArray",
						members: [
							{
								name: "data",
								type: "core::array::Array::<core::bytes_31::bytes31>",
							},
							{
								name: "pending_word",
								type: "core::felt252",
							},
							{
								name: "pending_word_len",
								type: "core::integer::u32",
							},
						],
					},
					{
						type: "interface",
						name: "dojo::meta::interface::IDeployedResource",
						items: [
							{
								type: "function",
								name: "dojo_name",
								inputs: [],
								outputs: [
									{
										type: "core::byte_array::ByteArray",
									},
								],
								state_mutability: "view",
							},
						],
					},
					{
						type: "impl",
						name: "ActionsImpl",
						interface_name: "pixelaw::core::actions::IActions",
					},
					{
						type: "struct",
						name: "pixelaw::core::models::pixel::Pixel",
						members: [
							{
								name: "x",
								type: "core::integer::u16",
							},
							{
								name: "y",
								type: "core::integer::u16",
							},
							{
								name: "app",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "color",
								type: "core::integer::u32",
							},
							{
								name: "created_at",
								type: "core::integer::u64",
							},
							{
								name: "updated_at",
								type: "core::integer::u64",
							},
							{
								name: "timestamp",
								type: "core::integer::u64",
							},
							{
								name: "owner",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "text",
								type: "core::felt252",
							},
							{
								name: "action",
								type: "core::felt252",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::integer::u32>",
						variants: [
							{
								name: "Some",
								type: "core::integer::u32",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
						variants: [
							{
								name: "Some",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::felt252>",
						variants: [
							{
								name: "Some",
								type: "core::felt252",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::integer::u64>",
						variants: [
							{
								name: "Some",
								type: "core::integer::u64",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::models::pixel::PixelUpdate",
						members: [
							{
								name: "x",
								type: "core::integer::u16",
							},
							{
								name: "y",
								type: "core::integer::u16",
							},
							{
								name: "color",
								type: "core::option::Option::<core::integer::u32>",
							},
							{
								name: "owner",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "app",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "text",
								type: "core::option::Option::<core::felt252>",
							},
							{
								name: "timestamp",
								type: "core::option::Option::<core::integer::u64>",
							},
							{
								name: "action",
								type: "core::option::Option::<core::felt252>",
							},
						],
					},
					{
						type: "enum",
						name: "core::bool",
						variants: [
							{
								name: "False",
								type: "()",
							},
							{
								name: "True",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "pixelaw::core::models::pixel::PixelUpdateResult",
						variants: [
							{
								name: "Ok",
								type: "pixelaw::core::models::pixel::PixelUpdate",
							},
							{
								name: "NotAllowed",
								type: "()",
							},
							{
								name: "Error",
								type: "core::felt252",
							},
						],
					},
					{
						type: "struct",
						name: "core::array::Span::<core::felt252>",
						members: [
							{
								name: "snapshot",
								type: "@core::array::Array::<core::felt252>",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::models::registry::App",
						members: [
							{
								name: "system",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "name",
								type: "core::felt252",
							},
							{
								name: "icon",
								type: "core::felt252",
							},
							{
								name: "action",
								type: "core::felt252",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::utils::Position",
						members: [
							{
								name: "x",
								type: "core::integer::u16",
							},
							{
								name: "y",
								type: "core::integer::u16",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::utils::Bounds",
						members: [
							{
								name: "x_min",
								type: "core::integer::u16",
							},
							{
								name: "y_min",
								type: "core::integer::u16",
							},
							{
								name: "x_max",
								type: "core::integer::u16",
							},
							{
								name: "y_max",
								type: "core::integer::u16",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::models::area::Area",
						members: [
							{
								name: "id",
								type: "core::integer::u64",
							},
							{
								name: "app",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "owner",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "color",
								type: "core::integer::u32",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<pixelaw::core::models::area::Area>",
						variants: [
							{
								name: "Some",
								type: "pixelaw::core::models::area::Area",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "struct",
						name: "core::array::Span::<pixelaw::core::models::area::Area>",
						members: [
							{
								name: "snapshot",
								type: "@core::array::Array::<pixelaw::core::models::area::Area>",
							},
						],
					},
					{
						type: "interface",
						name: "pixelaw::core::actions::IActions",
						items: [
							{
								type: "function",
								name: "init",
								inputs: [],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "can_update_pixel",
								inputs: [
									{
										name: "for_player",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "for_system",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "pixel",
										type: "pixelaw::core::models::pixel::Pixel",
									},
									{
										name: "pixel_update",
										type: "pixelaw::core::models::pixel::PixelUpdate",
									},
									{
										name: "area_id_hint",
										type: "core::option::Option::<core::integer::u64>",
									},
									{
										name: "allow_modify",
										type: "core::bool",
									},
								],
								outputs: [
									{
										type: "pixelaw::core::models::pixel::PixelUpdateResult",
									},
								],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "update_pixel",
								inputs: [
									{
										name: "for_player",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "for_system",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "pixel_update",
										type: "pixelaw::core::models::pixel::PixelUpdate",
									},
									{
										name: "area_id",
										type: "core::option::Option::<core::integer::u64>",
									},
									{
										name: "allow_modify",
										type: "core::bool",
									},
								],
								outputs: [
									{
										type: "pixelaw::core::models::pixel::PixelUpdateResult",
									},
								],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "process_queue",
								inputs: [
									{
										name: "id",
										type: "core::felt252",
									},
									{
										name: "timestamp",
										type: "core::integer::u64",
									},
									{
										name: "called_system",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "selector",
										type: "core::felt252",
									},
									{
										name: "calldata",
										type: "core::array::Span::<core::felt252>",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "schedule_queue",
								inputs: [
									{
										name: "timestamp",
										type: "core::integer::u64",
									},
									{
										name: "called_system",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "selector",
										type: "core::felt252",
									},
									{
										name: "calldata",
										type: "core::array::Span::<core::felt252>",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "new_app",
								inputs: [
									{
										name: "system",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "name",
										type: "core::felt252",
									},
									{
										name: "icon",
										type: "core::felt252",
									},
								],
								outputs: [
									{
										type: "pixelaw::core::models::registry::App",
									},
								],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "alert_player",
								inputs: [
									{
										name: "position",
										type: "pixelaw::core::utils::Position",
									},
									{
										name: "player",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "message",
										type: "core::felt252",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "add_area",
								inputs: [
									{
										name: "bounds",
										type: "pixelaw::core::utils::Bounds",
									},
									{
										name: "owner",
										type: "core::starknet::contract_address::ContractAddress",
									},
									{
										name: "color",
										type: "core::integer::u32",
									},
									{
										name: "app",
										type: "core::starknet::contract_address::ContractAddress",
									},
								],
								outputs: [
									{
										type: "pixelaw::core::models::area::Area",
									},
								],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "remove_area",
								inputs: [
									{
										name: "area_id",
										type: "core::integer::u64",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "find_area_by_position",
								inputs: [
									{
										name: "position",
										type: "pixelaw::core::utils::Position",
									},
								],
								outputs: [
									{
										type: "core::option::Option::<pixelaw::core::models::area::Area>",
									},
								],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "find_areas_inside_bounds",
								inputs: [
									{
										name: "bounds",
										type: "pixelaw::core::utils::Bounds",
									},
								],
								outputs: [
									{
										type: "core::array::Span::<pixelaw::core::models::area::Area>",
									},
								],
								state_mutability: "external",
							},
						],
					},
					{
						type: "function",
						name: "dojo_init",
						inputs: [],
						outputs: [],
						state_mutability: "view",
					},
					{
						type: "impl",
						name: "WorldProviderImpl",
						interface_name:
							"dojo::contract::components::world_provider::IWorldProvider",
					},
					{
						type: "struct",
						name: "dojo::world::iworld::IWorldDispatcher",
						members: [
							{
								name: "contract_address",
								type: "core::starknet::contract_address::ContractAddress",
							},
						],
					},
					{
						type: "interface",
						name: "dojo::contract::components::world_provider::IWorldProvider",
						items: [
							{
								type: "function",
								name: "world_dispatcher",
								inputs: [],
								outputs: [
									{
										type: "dojo::world::iworld::IWorldDispatcher",
									},
								],
								state_mutability: "view",
							},
						],
					},
					{
						type: "impl",
						name: "UpgradeableImpl",
						interface_name:
							"dojo::contract::components::upgradeable::IUpgradeable",
					},
					{
						type: "interface",
						name: "dojo::contract::components::upgradeable::IUpgradeable",
						items: [
							{
								type: "function",
								name: "upgrade",
								inputs: [
									{
										name: "new_class_hash",
										type: "core::starknet::class_hash::ClassHash",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
						],
					},
					{
						type: "constructor",
						name: "constructor",
						inputs: [],
					},
					{
						type: "event",
						name: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
						kind: "struct",
						members: [
							{
								name: "class_hash",
								type: "core::starknet::class_hash::ClassHash",
								kind: "data",
							},
						],
					},
					{
						type: "event",
						name: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
						kind: "enum",
						variants: [
							{
								name: "Upgraded",
								type: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
								kind: "nested",
							},
						],
					},
					{
						type: "event",
						name: "dojo::contract::components::world_provider::world_provider_cpt::Event",
						kind: "enum",
						variants: [],
					},
					{
						type: "event",
						name: "pixelaw::core::actions::actions::Event",
						kind: "enum",
						variants: [
							{
								name: "UpgradeableEvent",
								type: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
								kind: "nested",
							},
							{
								name: "WorldProviderEvent",
								type: "dojo::contract::components::world_provider::world_provider_cpt::Event",
								kind: "nested",
							},
						],
					},
				],
				init_calldata: [],
				tag: "pixelaw-actions",
				selector:
					"0x16928a49cfd8cf14e9f41e9d8f873890d1ab7d23b9a312d8a72f4031159876f",
				systems: [
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
					"upgrade",
				],
			},
			{
				address:
					"0x5e182fd8c6a2b35c0e9d465c8092d343ed9424c10b51a9c527c6fb250e42ed1",
				class_hash:
					"0x9de2509144750b45f809c2e230648010b267b47732696f3178d6a98afe0015",
				abi: [
					{
						type: "impl",
						name: "paint_actions__ContractImpl",
						interface_name: "dojo::contract::interface::IContract",
					},
					{
						type: "interface",
						name: "dojo::contract::interface::IContract",
						items: [],
					},
					{
						type: "impl",
						name: "paint_actions__DeployedContractImpl",
						interface_name: "dojo::meta::interface::IDeployedResource",
					},
					{
						type: "struct",
						name: "core::byte_array::ByteArray",
						members: [
							{
								name: "data",
								type: "core::array::Array::<core::bytes_31::bytes31>",
							},
							{
								name: "pending_word",
								type: "core::felt252",
							},
							{
								name: "pending_word_len",
								type: "core::integer::u32",
							},
						],
					},
					{
						type: "interface",
						name: "dojo::meta::interface::IDeployedResource",
						items: [
							{
								type: "function",
								name: "dojo_name",
								inputs: [],
								outputs: [
									{
										type: "core::byte_array::ByteArray",
									},
								],
								state_mutability: "view",
							},
						],
					},
					{
						type: "impl",
						name: "Actions",
						interface_name: "pixelaw::apps::paint::app::IPaintActions",
					},
					{
						type: "enum",
						name: "core::option::Option::<core::integer::u32>",
						variants: [
							{
								name: "Some",
								type: "core::integer::u32",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
						variants: [
							{
								name: "Some",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::felt252>",
						variants: [
							{
								name: "Some",
								type: "core::felt252",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::integer::u64>",
						variants: [
							{
								name: "Some",
								type: "core::integer::u64",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::models::pixel::PixelUpdate",
						members: [
							{
								name: "x",
								type: "core::integer::u16",
							},
							{
								name: "y",
								type: "core::integer::u16",
							},
							{
								name: "color",
								type: "core::option::Option::<core::integer::u32>",
							},
							{
								name: "owner",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "app",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "text",
								type: "core::option::Option::<core::felt252>",
							},
							{
								name: "timestamp",
								type: "core::option::Option::<core::integer::u64>",
							},
							{
								name: "action",
								type: "core::option::Option::<core::felt252>",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::models::registry::App",
						members: [
							{
								name: "system",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "name",
								type: "core::felt252",
							},
							{
								name: "icon",
								type: "core::felt252",
							},
							{
								name: "action",
								type: "core::felt252",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<pixelaw::core::models::pixel::PixelUpdate>",
						variants: [
							{
								name: "Some",
								type: "pixelaw::core::models::pixel::PixelUpdate",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::utils::Position",
						members: [
							{
								name: "x",
								type: "core::integer::u16",
							},
							{
								name: "y",
								type: "core::integer::u16",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::utils::DefaultParameters",
						members: [
							{
								name: "player_override",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "system_override",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "area_hint",
								type: "core::option::Option::<core::integer::u64>",
							},
							{
								name: "position",
								type: "pixelaw::core::utils::Position",
							},
							{
								name: "color",
								type: "core::integer::u32",
							},
						],
					},
					{
						type: "struct",
						name: "core::array::Span::<core::felt252>",
						members: [
							{
								name: "snapshot",
								type: "@core::array::Array::<core::felt252>",
							},
						],
					},
					{
						type: "interface",
						name: "pixelaw::apps::paint::app::IPaintActions",
						items: [
							{
								type: "function",
								name: "init",
								inputs: [],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "on_pre_update",
								inputs: [
									{
										name: "pixel_update",
										type: "pixelaw::core::models::pixel::PixelUpdate",
									},
									{
										name: "app_caller",
										type: "pixelaw::core::models::registry::App",
									},
									{
										name: "player_caller",
										type: "core::starknet::contract_address::ContractAddress",
									},
								],
								outputs: [
									{
										type: "core::option::Option::<pixelaw::core::models::pixel::PixelUpdate>",
									},
								],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "on_post_update",
								inputs: [
									{
										name: "pixel_update",
										type: "pixelaw::core::models::pixel::PixelUpdate",
									},
									{
										name: "app_caller",
										type: "pixelaw::core::models::registry::App",
									},
									{
										name: "player_caller",
										type: "core::starknet::contract_address::ContractAddress",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "interact",
								inputs: [
									{
										name: "default_params",
										type: "pixelaw::core::utils::DefaultParameters",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "put_color",
								inputs: [
									{
										name: "default_params",
										type: "pixelaw::core::utils::DefaultParameters",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "fade",
								inputs: [
									{
										name: "default_params",
										type: "pixelaw::core::utils::DefaultParameters",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "pixel_row",
								inputs: [
									{
										name: "default_params",
										type: "pixelaw::core::utils::DefaultParameters",
									},
									{
										name: "image_data",
										type: "core::array::Span::<core::felt252>",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
						],
					},
					{
						type: "function",
						name: "dojo_init",
						inputs: [],
						outputs: [],
						state_mutability: "view",
					},
					{
						type: "impl",
						name: "WorldProviderImpl",
						interface_name:
							"dojo::contract::components::world_provider::IWorldProvider",
					},
					{
						type: "struct",
						name: "dojo::world::iworld::IWorldDispatcher",
						members: [
							{
								name: "contract_address",
								type: "core::starknet::contract_address::ContractAddress",
							},
						],
					},
					{
						type: "interface",
						name: "dojo::contract::components::world_provider::IWorldProvider",
						items: [
							{
								type: "function",
								name: "world_dispatcher",
								inputs: [],
								outputs: [
									{
										type: "dojo::world::iworld::IWorldDispatcher",
									},
								],
								state_mutability: "view",
							},
						],
					},
					{
						type: "impl",
						name: "UpgradeableImpl",
						interface_name:
							"dojo::contract::components::upgradeable::IUpgradeable",
					},
					{
						type: "interface",
						name: "dojo::contract::components::upgradeable::IUpgradeable",
						items: [
							{
								type: "function",
								name: "upgrade",
								inputs: [
									{
										name: "new_class_hash",
										type: "core::starknet::class_hash::ClassHash",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
						],
					},
					{
						type: "constructor",
						name: "constructor",
						inputs: [],
					},
					{
						type: "event",
						name: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
						kind: "struct",
						members: [
							{
								name: "class_hash",
								type: "core::starknet::class_hash::ClassHash",
								kind: "data",
							},
						],
					},
					{
						type: "event",
						name: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
						kind: "enum",
						variants: [
							{
								name: "Upgraded",
								type: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
								kind: "nested",
							},
						],
					},
					{
						type: "event",
						name: "dojo::contract::components::world_provider::world_provider_cpt::Event",
						kind: "enum",
						variants: [],
					},
					{
						type: "event",
						name: "pixelaw::apps::paint::app::paint_actions::Event",
						kind: "enum",
						variants: [
							{
								name: "UpgradeableEvent",
								type: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
								kind: "nested",
							},
							{
								name: "WorldProviderEvent",
								type: "dojo::contract::components::world_provider::world_provider_cpt::Event",
								kind: "nested",
							},
						],
					},
				],
				init_calldata: [],
				tag: "pixelaw-paint_actions",
				selector:
					"0x2afb94fee3f58a7234658d0fd5366da8a9c48a4978cc6fff464344d2720123d",
				systems: [
					"init",
					"on_pre_update",
					"on_post_update",
					"interact",
					"put_color",
					"fade",
					"pixel_row",
					"upgrade",
				],
			},
			{
				address:
					"0x1a73ac17c394f75e1bdb91943196839c4aa34e3f0fe2fdb50224d090a17158a",
				class_hash:
					"0x5bde5cee7f53ff48b2a1a47a51ddb279c68a3777bfca0dda5b42d0257ffd2dc",
				abi: [
					{
						type: "impl",
						name: "snake_actions__ContractImpl",
						interface_name: "dojo::contract::interface::IContract",
					},
					{
						type: "interface",
						name: "dojo::contract::interface::IContract",
						items: [],
					},
					{
						type: "impl",
						name: "snake_actions__DeployedContractImpl",
						interface_name: "dojo::meta::interface::IDeployedResource",
					},
					{
						type: "struct",
						name: "core::byte_array::ByteArray",
						members: [
							{
								name: "data",
								type: "core::array::Array::<core::bytes_31::bytes31>",
							},
							{
								name: "pending_word",
								type: "core::felt252",
							},
							{
								name: "pending_word_len",
								type: "core::integer::u32",
							},
						],
					},
					{
						type: "interface",
						name: "dojo::meta::interface::IDeployedResource",
						items: [
							{
								type: "function",
								name: "dojo_name",
								inputs: [],
								outputs: [
									{
										type: "core::byte_array::ByteArray",
									},
								],
								state_mutability: "view",
							},
						],
					},
					{
						type: "impl",
						name: "ActionsImpl",
						interface_name: "pixelaw::apps::snake::app::ISnakeActions",
					},
					{
						type: "enum",
						name: "core::option::Option::<core::integer::u32>",
						variants: [
							{
								name: "Some",
								type: "core::integer::u32",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
						variants: [
							{
								name: "Some",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::felt252>",
						variants: [
							{
								name: "Some",
								type: "core::felt252",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<core::integer::u64>",
						variants: [
							{
								name: "Some",
								type: "core::integer::u64",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::models::pixel::PixelUpdate",
						members: [
							{
								name: "x",
								type: "core::integer::u16",
							},
							{
								name: "y",
								type: "core::integer::u16",
							},
							{
								name: "color",
								type: "core::option::Option::<core::integer::u32>",
							},
							{
								name: "owner",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "app",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "text",
								type: "core::option::Option::<core::felt252>",
							},
							{
								name: "timestamp",
								type: "core::option::Option::<core::integer::u64>",
							},
							{
								name: "action",
								type: "core::option::Option::<core::felt252>",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::models::registry::App",
						members: [
							{
								name: "system",
								type: "core::starknet::contract_address::ContractAddress",
							},
							{
								name: "name",
								type: "core::felt252",
							},
							{
								name: "icon",
								type: "core::felt252",
							},
							{
								name: "action",
								type: "core::felt252",
							},
						],
					},
					{
						type: "enum",
						name: "core::option::Option::<pixelaw::core::models::pixel::PixelUpdate>",
						variants: [
							{
								name: "Some",
								type: "pixelaw::core::models::pixel::PixelUpdate",
							},
							{
								name: "None",
								type: "()",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::utils::Position",
						members: [
							{
								name: "x",
								type: "core::integer::u16",
							},
							{
								name: "y",
								type: "core::integer::u16",
							},
						],
					},
					{
						type: "struct",
						name: "pixelaw::core::utils::DefaultParameters",
						members: [
							{
								name: "player_override",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "system_override",
								type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
							},
							{
								name: "area_hint",
								type: "core::option::Option::<core::integer::u64>",
							},
							{
								name: "position",
								type: "pixelaw::core::utils::Position",
							},
							{
								name: "color",
								type: "core::integer::u32",
							},
						],
					},
					{
						type: "enum",
						name: "pixelaw::core::utils::Direction",
						variants: [
							{
								name: "None",
								type: "()",
							},
							{
								name: "Left",
								type: "()",
							},
							{
								name: "Right",
								type: "()",
							},
							{
								name: "Up",
								type: "()",
							},
							{
								name: "Down",
								type: "()",
							},
						],
					},
					{
						type: "interface",
						name: "pixelaw::apps::snake::app::ISnakeActions",
						items: [
							{
								type: "function",
								name: "on_pre_update",
								inputs: [
									{
										name: "pixel_update",
										type: "pixelaw::core::models::pixel::PixelUpdate",
									},
									{
										name: "app_caller",
										type: "pixelaw::core::models::registry::App",
									},
									{
										name: "player_caller",
										type: "core::starknet::contract_address::ContractAddress",
									},
								],
								outputs: [
									{
										type: "core::option::Option::<pixelaw::core::models::pixel::PixelUpdate>",
									},
								],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "on_post_update",
								inputs: [
									{
										name: "pixel_update",
										type: "pixelaw::core::models::pixel::PixelUpdate",
									},
									{
										name: "app_caller",
										type: "pixelaw::core::models::registry::App",
									},
									{
										name: "player_caller",
										type: "core::starknet::contract_address::ContractAddress",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "init",
								inputs: [],
								outputs: [],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "interact",
								inputs: [
									{
										name: "default_params",
										type: "pixelaw::core::utils::DefaultParameters",
									},
									{
										name: "direction",
										type: "pixelaw::core::utils::Direction",
									},
								],
								outputs: [
									{
										type: "core::integer::u32",
									},
								],
								state_mutability: "external",
							},
							{
								type: "function",
								name: "move",
								inputs: [
									{
										name: "owner",
										type: "core::starknet::contract_address::ContractAddress",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
						],
					},
					{
						type: "function",
						name: "dojo_init",
						inputs: [],
						outputs: [],
						state_mutability: "view",
					},
					{
						type: "impl",
						name: "WorldProviderImpl",
						interface_name:
							"dojo::contract::components::world_provider::IWorldProvider",
					},
					{
						type: "struct",
						name: "dojo::world::iworld::IWorldDispatcher",
						members: [
							{
								name: "contract_address",
								type: "core::starknet::contract_address::ContractAddress",
							},
						],
					},
					{
						type: "interface",
						name: "dojo::contract::components::world_provider::IWorldProvider",
						items: [
							{
								type: "function",
								name: "world_dispatcher",
								inputs: [],
								outputs: [
									{
										type: "dojo::world::iworld::IWorldDispatcher",
									},
								],
								state_mutability: "view",
							},
						],
					},
					{
						type: "impl",
						name: "UpgradeableImpl",
						interface_name:
							"dojo::contract::components::upgradeable::IUpgradeable",
					},
					{
						type: "interface",
						name: "dojo::contract::components::upgradeable::IUpgradeable",
						items: [
							{
								type: "function",
								name: "upgrade",
								inputs: [
									{
										name: "new_class_hash",
										type: "core::starknet::class_hash::ClassHash",
									},
								],
								outputs: [],
								state_mutability: "external",
							},
						],
					},
					{
						type: "constructor",
						name: "constructor",
						inputs: [],
					},
					{
						type: "event",
						name: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
						kind: "struct",
						members: [
							{
								name: "class_hash",
								type: "core::starknet::class_hash::ClassHash",
								kind: "data",
							},
						],
					},
					{
						type: "event",
						name: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
						kind: "enum",
						variants: [
							{
								name: "Upgraded",
								type: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
								kind: "nested",
							},
						],
					},
					{
						type: "event",
						name: "dojo::contract::components::world_provider::world_provider_cpt::Event",
						kind: "enum",
						variants: [],
					},
					{
						type: "event",
						name: "pixelaw::apps::snake::app::snake_actions::Event",
						kind: "enum",
						variants: [
							{
								name: "UpgradeableEvent",
								type: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
								kind: "nested",
							},
							{
								name: "WorldProviderEvent",
								type: "dojo::contract::components::world_provider::world_provider_cpt::Event",
								kind: "nested",
							},
						],
					},
				],
				init_calldata: [],
				tag: "pixelaw-snake_actions",
				selector:
					"0x4f96710669719291ad9660428d2dc9c921f129b75ddf0f70e8bf5837ea4157e",
				systems: [
					"on_pre_update",
					"on_post_update",
					"init",
					"interact",
					"move",
					"upgrade",
				],
			},
		],
		libraries: [],
		models: [
			{
				members: [],
				class_hash:
					"0x69c806377ce49ee16eb6611f8a2918cab562ffd3e572fc57974956daf68ef77",
				tag: "pixelaw-App",
				selector:
					"0x3650456503601ce448928ac87c54e3a6e95e76d725a59c95c7201324c9b2b74",
			},
			{
				members: [],
				class_hash:
					"0x5b2db85c691a4a3583660598d506a61050156f8ae224fe1c03de114a65500f9",
				tag: "pixelaw-AppName",
				selector:
					"0x3b816829f5d924b5acc1c44d28b6b61b4edd94e62444c536b2bdc85c0e70a2a",
			},
			{
				members: [],
				class_hash:
					"0x5944128880d7bcd6e3efb666cf27b674f2494beeafcc0f1c26a87a84aa62eef",
				tag: "pixelaw-AppUser",
				selector:
					"0x4eda3c525958eca36164ba6f96e2b7591304838960197934ac8ae0a4b08b20f",
			},
			{
				members: [],
				class_hash:
					"0x1c5ccb0f02d7239e6873da890f8b60609e9b09df0ffa48132198a984da05e",
				tag: "pixelaw-Area",
				selector:
					"0x41f22f1725b6e571bd66653e79fd700d80cc35c56f9dc5d663802e57478194",
			},
			{
				members: [],
				class_hash:
					"0x6336b1cf57d40512193891849a69e7e128b697578061068430078c560983265",
				tag: "pixelaw-CoreActionsAddress",
				selector:
					"0x5379e1ce3a70cb70f1e96dae1b142164574f33d4e32cebdb965b5aec30222c5",
			},
			{
				members: [],
				class_hash:
					"0x2123dffc88b2c9fa4a96d047535f41ab43cd5d6eabbf3053666b7bfe013298",
				tag: "pixelaw-Pixel",
				selector:
					"0x7e607b2fbb4cfb3fb9d1258fa2ff3aa94f17b3820e42bf1e6a43e2de3f5772e",
			},
			{
				members: [],
				class_hash:
					"0x3b0515dfc0d09a190026b1880720cce4dba0beeea1c70ceb271cd8334b52161",
				tag: "pixelaw-QueueItem",
				selector:
					"0x549a17f23ab80595d9abd4d989a3d4bf0c1987ebc08ad48aecab0f1e8c311b4",
			},
			{
				members: [],
				class_hash:
					"0x670fbb3ca4a5cc0e78e92951c7dd3013d453d820be28b50fb444c27d48d299",
				tag: "pixelaw-RTree",
				selector:
					"0x3baaf9fe25823e8928b6fc6400e28e98d4b7618ff56faf269a11f3400a1c105",
			},
			{
				members: [],
				class_hash:
					"0x452c8f07ebd0d384499fe5a3810504a44f1feac9e447b26f1968c1a72259d43",
				tag: "pixelaw-Snake",
				selector:
					"0x62b876d4cd94e88d2c363c3515ce2c9e8af1badad47a8dc96966543970658c1",
			},
			{
				members: [],
				class_hash:
					"0x13552d32a060045bfbcde7531987c23e75b1956765b51693dd8dfed1098c2d8",
				tag: "pixelaw-SnakeSegment",
				selector:
					"0x302de0d87f8997cb65a4f7edb9a792706446961826bd4a16cbfb47fa09146ed",
			},
		],
		events: [
			{
				members: [],
				class_hash:
					"0x2d78ab0a0a6c395def4742913ada143407a416b43af4946ab417b2505de9d77",
				tag: "pixelaw-Alert",
				selector:
					"0x2a2938533e310a064aa2181f2cbb5914d80ac492be60f23fd358a49f47c26a2",
			},
			{
				members: [],
				class_hash:
					"0x43c6621153f4e3fc50bed2b5a3562c11f5a829cce5ee4ac267b700829475336",
				tag: "pixelaw-Died",
				selector:
					"0x7d747e04206de964d63ff53216dcde822fd170b7c1d55ef7fc92dce1d6dbad8",
			},
			{
				members: [],
				class_hash:
					"0x1972c0ed4bd91b733d74f50c00fa78be9088b62e3745dbb974ae401cc0d5e01",
				tag: "pixelaw-Moved",
				selector:
					"0x2b409f0cebc7c8b0091267d7ed51567a6c0aae7147a86c07b854a1cc448aa28",
			},
			{
				members: [],
				class_hash:
					"0x2983552d584a4de1de733aa50f04abf2f613243270693a390426418b54b5391",
				tag: "pixelaw-QueueProcessed",
				selector:
					"0x6998c9cd795c72fd0cab90978a79bcdbe098723ec9a67e725a17104677743eb",
			},
			{
				members: [],
				class_hash:
					"0x3ae8e6d38248c75be91fc47863a14e2999cb6416bf85ce6f97231ccd8f4a9ea",
				tag: "pixelaw-QueueScheduled",
				selector:
					"0x32e74bc9762cc0dcdb6c7b67b35ded5b22a785e7c924673d6163369e6c6f769",
			},
		],
		external_contracts: [],
	};
}
