import { type DojoCall, type DojoProvider, parseDojoCall } from "@dojoengine/core"
import type { DojoWallet } from "./DojoWallet.ts"
import { type Coordinate, type Executor, NAMESPACE, parsePixelError, type PixelawCore } from "@pixelaw/core"
import { Account, type AccountInterface, type BigNumberish, ReceiptTx, type UniversalDetails } from "starknet"
import { customExecute } from "./utils/customExecute.ts"
import type { OptimisticNonceAccount } from "./utils/OptimisticNonceAccount.ts"

interface ExecutionTask {
    dojoCall: DojoCall
    onSuccess: (result: unknown) => void
    onFail: (error: unknown) => void
}

// I don't know if we need a special queueing system for this, but after some troubles
//  decided to put one in. This would also be the place for more advanced nonce mangement
//  if we need it
export class DojoExecutor implements Executor {
    private core: PixelawCore
    private queue: ExecutionTask[] = []
    private executing = false
    private provider: DojoProvider
    private _wallet: DojoWallet
    private _nonce: BigNumberish = "0x9"
    private _account: AccountInterface

    constructor(core: PixelawCore, provider: DojoProvider) {
        this.core = core
        this.provider = provider
        // this.account = wallet.getAccount() as OptimisticNonceAccount
        // this.account.execute = optimisticExecute.bind(this.account)

        // this.provider.provider.getNonceForAddress(account.address, "latest")
    }

    public set account(newAccount: AccountInterface) {
        this._account = newAccount
        this.syncNonce().then(() => {
            // let it finish
        })
    }

    public get pendingCalls(): number {
        return this.queue.length
    }

    public enqueue(dojoCall: DojoCall, onSuccess: (result: unknown) => void, onFail: (error: unknown) => void): void {
        this.queue.push({ dojoCall, onSuccess, onFail })
        this.processQueue()
    }

    public set wallet(wallet: DojoWallet) {
        this._wallet = wallet
    }

    private async syncNonce() {
        this._nonce = await this._account.getNonce()
        console.log("aa", this._nonce)
    }

    private async processQueue(): Promise<void> {
        if (this.executing || this.queue.length === 0) return
        if (!this.core.account) {
            console.log("account not loaded")
            return
        }

        this.executing = true
        const task = this.queue.shift()!
        const account = this.core.account

        // biome-ignore lint/complexity/useLiteralKeys: We're customizing account
        account["customExecute"] = customExecute.bind(account)

        try {
            const options: UniversalDetails = {
                version: 3,
                blockIdentifier: "pending",
                nonce: this._nonce,
            }

            const call = parseDojoCall(this.provider.manifest, NAMESPACE, task.dojoCall)

            // @ts-ignore was bound above
            const { transaction_hash } = await account.customExecute([call], options)

            const [_, receipt] = await Promise.all([
                this.syncNonce(),
                this.provider.provider.getTransactionReceipt(transaction_hash),
            ])

            if (receipt.isSuccess()) {
                task.onSuccess(receipt)
            } else {
                // biome-ignore lint/complexity/useLiteralKeys: TODO
                task.onFail(receipt["revert_reason"])
            }
        } catch (error) {
            task.onFail(error)
        } finally {
            this.executing = false
            this.processQueue()
        }
    }
}
function parseError(error: string): { coordinate: Coordinate; error: string } {
    const regex = /Failure reason: "([^"]+)"/
    const match = error.match(regex)

    if (!match) {
        return { coordinate: null, error }
    }

    const failureReason = match[1]
    const pixelError = parsePixelError(failureReason)
    return pixelError
}
