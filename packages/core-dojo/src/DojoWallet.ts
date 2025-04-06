import { type BaseWallet, Wallet } from "@pixelaw/core"
import type { AccountInterface } from "starknet"
import { ENGINE_ID } from "./types.ts"

export type DojoWalletId =
    | "argentX"
    | "argentMobile"
    | "argentWeb"
    | "braavos"
    | "burner"
    | "predeployed"
    | "controller"

export class DojoWallet extends Wallet {
    private account: AccountInterface

    constructor(walletId: DojoWalletId, chainId: string, account: AccountInterface) {
        super(ENGINE_ID, walletId, account.address, chainId)
        this.account = account
    }

    getAccount(): AccountInterface {
        return this.account
    }

    toJSON(): BaseWallet {
        const { engine, id, address, chainId } = this
        return { engine, id, address, chainId }
    }
}
