import { ControllerConnector } from "@cartridge/connector";

import type { ControllerOptions } from "@cartridge/controller";
import type { Connector } from "@starknet-react/core";
import { cartridgeProvider } from "@starknet-react/core";

const policies = [];

const options: ControllerOptions = {
	rpc: cartridgeProvider().nodeUrl,
	policies,
	// theme: "dope-wars",
	// colorMode: "light"
};

const cartridgeConnector = new ControllerConnector(
	options,
) as never as Connector;

export default cartridgeConnector;
