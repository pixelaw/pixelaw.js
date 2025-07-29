import { type BaseWallet, Wallet } from "@pixelaw/core";
import type { AccountInterface } from "starknet";
import { ENGINE_ID } from "./types.ts";

export type DojoWalletId =
	| "argentX"
	| "argentMobile"
	| "argentWeb"
	| "braavos"
	| "burner"
	| "predeployed"
	| "controller";

export class DojoWallet extends Wallet {
	private _account: AccountInterface;
	private _isConnected = false;

	constructor(
		walletId: DojoWalletId,
		chainId: string,
		account: AccountInterface,
	) {
		super(ENGINE_ID, walletId, account.address, chainId);
		this._account = account;
	}

	get account(): AccountInterface {
		return this._account;
	}

	get isConnected(): boolean {
		return this._isConnected;
	}

	toJSON(): BaseWallet {
		const { engine, id, address, chainId } = this;
		return { engine, id, address, chainId };
	}
}
