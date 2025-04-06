import type { DojoCall, DojoProvider } from "@dojoengine/core"
import type { DojoWallet } from "./DojoWallet.ts"
import { type Executor, NAMESPACE } from "@pixelaw/core"
import type { UniversalDetails } from "starknet"

interface ExecutionTask {
    dojoCall: DojoCall
    onSuccess: (result: unknown) => void
    onFail: (error: unknown) => void
}

// I don't know if we need a special queueing system for this, but after some troubles
//  decided to put one in. This would also be the place for more advanced nonce mangement
//  if we need it
export class DojoExecutor implements Executor {
    private queue: ExecutionTask[] = []
    private executing = false
    private provider: DojoProvider
    private _wallet: DojoWallet

    constructor(provider: DojoProvider, wallet: DojoWallet | null) {
        this.provider = provider
        this._wallet = wallet
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

    private async processQueue(): Promise<void> {
        if (this.executing || this.queue.length === 0) return
        if (!this._wallet.getAccount) {
            console.log("account not loaded")
            return
        }

        this.executing = true
        const task = this.queue.shift()!
        const account = this._wallet.getAccount()

        try {
            // const nonce = await this.provider.provider.getNonceForAddress(account.address, "latest")
            const options: UniversalDetails = {
                version: 3,
                // blockIdentifier: "pending",
                // nonce,
            }

            const result = await this.provider.execute(account, task.dojoCall, NAMESPACE, options)
            task.onSuccess(result)
        } catch (error) {
            task.onFail(error)
        } finally {
            this.executing = false
            this.processQueue()
        }
    }
}
