import type {Wallet, WalletJson} from "@pixelaw/core";
import type { AccountInterface} from "starknet";
import {ENGINE_ID} from "./types.ts";

export type DojoWalletId =
    | "argentX"
    | "argentMobile"
    | "argentWeb"
    | "braavos"
    | "burner"
    | "controller";

export class DojoWallet implements Wallet{
    id: DojoWalletId;
    address: string;
    chainId: string
    account: AccountInterface

    constructor(walletId: DojoWalletId, chainId: string, account: AccountInterface) {
        this.id = walletId
        this.address = account.address
        this.chainId = chainId
        this.account = account
        console.log({walletId, chainId: this.chainId})
    }

    getAccount(): AccountInterface {
        return this.account;
    }

    toJSON(): WalletJson {
        const { id, address, chainId } = this;
        return { engine: ENGINE_ID, id, address, chainId };
    }

}