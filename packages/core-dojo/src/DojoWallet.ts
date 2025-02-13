import type {Wallet} from "@pixelaw/core";
import type {Account} from "starknet";

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
    account: Account

    constructor(walletId: DojoWalletId, account: Account) {
        this.id = walletId
        this.address = account.address
        this.chainId = account.channel.chainId  // TODO see if we can access the private field like this
        this.account = account
        console.log({walletId, chainId: this.chainId})
    }

    getAccount(): Account {
        return this.account;
    }

}