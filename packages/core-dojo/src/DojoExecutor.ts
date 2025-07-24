import {
  type DojoCall,
  type DojoProvider,
  parseDojoCall,
} from "@dojoengine/core";
import {
  type Coordinate,
  type Executor,
  NAMESPACE,
  type PixelawCore,
  parsePixelError,
} from "@pixelaw/core";
import type {
  AccountInterface,
  BigNumberish,
  UniversalDetails,
} from "starknet";
import type { DojoWallet } from "./DojoWallet.ts";
import { parseEventsFromSimulation } from "./utils/parseEvents.ts";

interface ExecutionTask {
  dojoCall: DojoCall;
  onSuccess: (result: unknown) => void;
  onFail: (error: unknown) => void;
}

// I don't know if we need a special queueing system for this, but after some troubles
//  decided to put one in. This would also be the place for more advanced nonce mangement
//  if we need it
export class DojoExecutor implements Executor {
  private core: PixelawCore;
  private queue: ExecutionTask[] = [];
  private executing = false;
  private provider: DojoProvider;
  private _wallet: DojoWallet;
  private _nonce: BigNumberish = "0x9";
  private _account: AccountInterface;

  constructor(core: PixelawCore, provider: DojoProvider) {
    this.core = core;
    this.provider = provider;
    // this.account = wallet.getAccount() as OptimisticNonceAccount
    // this.account.execute = optimisticExecute.bind(this.account)

    // this.provider.provider.getNonceForAddress(account.address, "latest")
  }

  public set account(newAccount: AccountInterface) {
    this._account = newAccount;
    // this.syncNonce().then(() => {
    //     // let it finish
    // })
  }

  public get pendingCalls(): number {
    return this.queue.length;
  }

  public enqueue(
    dojoCall: DojoCall,
    onSuccess: (result: unknown) => void,
    onFail: (error: unknown) => void,
  ): void {
    this.queue.push({ dojoCall, onSuccess, onFail });
    this.processQueue();
  }

  public set wallet(wallet: DojoWallet) {
    this._wallet = wallet;
  }

  private async syncNonce() {
    this._nonce = await this._account.getNonce();
    console.log("aa", this._nonce);
  }

  private async processQueue(): Promise<void> {
    if (this.executing || this.queue.length === 0) {
      console.log(
        "DojoExecutor: Skipping processQueue - executing:",
        this.executing,
        "queue empty:",
        this.queue.length === 0,
      );
      return;
    }

    if (!this.core.account) {
      console.log("DojoExecutor: account not loaded");
      return;
    }

    // Determine the correct way to access the account
    let account: AccountInterface | null = null;

    if (this.core.account.walletProvider?.account) {
      // Legacy path - account is nested in walletProvider
      account = this.core.account.walletProvider.account as AccountInterface;
      console.log("DojoExecutor: Using walletProvider.account path");
    } else if (this.core.account.account) {
      // DojoWallet path - account is in .account property
      account = this.core.account.account as AccountInterface;
      console.log("DojoExecutor: Using DojoWallet.account path");
    } else if (this.core.account.address && this.core.account.execute) {
      // Direct AccountInterface - core.account is the account itself
      account = this.core.account as AccountInterface;
    }

    if (!account) {
      console.log(
        "DojoExecutor: Could not find account in any expected location",
      );
      return;
    }

    this.executing = true;
    const task = this.queue.shift()!;
    try {
      // Get the current nonce from the account instead of using cached nonce
      const currentNonce = await account.getNonce();
      // Update our cached nonce
      this._nonce = currentNonce;

      const options: UniversalDetails = {
        version: 3,
        blockIdentifier: "pending",
        nonce: currentNonce,
      };

      const call = parseDojoCall(
        this.provider.manifest,
        NAMESPACE,
        task.dojoCall,
      );

      console.log(account);

      const [sim, { transaction_hash }] = await Promise.all([
        account.simulateTransaction(
          [
            {
              ...call,
              type: "INVOKE_FUNCTION",
            },
          ],
          options,
        ),
        account.execute([call], options),
      ]);
      console.log("s", sim[0], transaction_hash);

      // FIXME somehow the actual simulation output is not conforming the types
      if (sim[0].transaction_trace?.execute_invocation?.revert_reason) {
        const error = sim[0].transaction_trace.execute_invocation.revert_reason;

        console.log("fail", error);
        task.onFail(error);
      } else {
        // TODO parse the sim for all the pixel changes and apply those to the PixelStore
        const pixels = parseEventsFromSimulation(
          "0x7e607b2fbb4cfb3fb9d1258fa2ff3aa94f17b3820e42bf1e6a43e2de3f5772e",
          sim,
        );

        this.core.updateService["channel"].publish(
          "PixelUpdate",
          JSON.stringify(pixels),
        );

        /*
                // TODO properly implement the messaging using DOJO.
                // Right now it's changing drastically so i used Ably just to get it working.
                //
                //
                this.core.pixelStore.setPixels(pixels)
                // console.info(pixels)
                //
                const msg = this.core.engine.dojoSetup.sdk.generateTypedData("pixelaw-Pixel", {
                    position: { x: 123, y: 321 },
                    action: "ac",
                    color: 1234,
                    owner: "",
                    text: "ac",
                    timestamp: "dd",
                    app: "app",
                })
                console.log("msg", msg)
                try {
                    const signature = await account.signMessage(msg)

                    console.log("s", signature)

                    try {
                        await this.core.engine.dojoSetup.sdk.client.publishMessage(
                            JSON.stringify(msg),
                            signature as string[],
                        )
                        console.log("yay published")
                        // reset()
                    } catch (error) {
                        console.error("failed to publish message:", error)
                    }

                } catch (error) {
                    console.error("failed to sign message:", error)
                }
                console.info(msg)
*/
        task.onSuccess(sim[0]);
      }
    } catch (error) {
      console.log(error);
      task.onFail(error);
    } finally {
      console.log("done!");
      this.executing = false;
      this.processQueue();
    }
  }
}

/*
Transaction execution has failed:
0: Error in the called contract (contract address: 0x05f59e1c371465a83f4a10d040627be37967c02e8fbe5c5f0afe1068e7cd0718, class hash: 0x0743c83c41ce99ad470aa308823f417b2141e02e04571f5c0004e743556e7faf, selector: 0x015d40a3d6ca2ac30f4031e42be28da9b056fef9bb7357ac5e85627ee876e5ad):
Execution failed. Failure reason:
(0x617267656e742f6d756c746963616c6c2d6661696c6564 ('argent/multicall-failed'), 0x0 (''), "10_12 Another player is here", 0x454e545259504f494e545f4641494c4544 ('ENTRYPOINT_FAILED')).
*/
function parseError(error: string): { coordinate: Coordinate; error: string } {
  const regex = /"\s*(\d+_\d+\s[^"]+)\s*"/;
  const match = error.match(regex);

  if (!match) {
    return { coordinate: null, error };
  }

  const failureReason = match[1];
  const pixelError = parsePixelError(failureReason);
  return pixelError;
}
