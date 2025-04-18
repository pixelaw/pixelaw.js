import {
    type Account,
    type AllowArray,
    type Call,
    type UniversalDetails,
    type InvokeFunctionResponse,
    type InvocationsSignerDetails,
    transaction,
    stark,
} from "starknet"

export async function customExecute(
    this: Account,
    transactions: AllowArray<Call>,
    transactionsDetail?: UniversalDetails,
): Promise<InvokeFunctionResponse> {
    const details = transactionsDetail || {}
    const calls = Array.isArray(transactions) ? transactions : [transactions]

    const version = "0x3" // hardcode to v3

    const chainId = await this.getChainId()

    const signerDetails: InvocationsSignerDetails = {
        ...stark.v3Details(details),
        walletAddress: this.address,
        nonce: transactionsDetail.nonce,
        version,
        chainId,
        cairoVersion: await this.getCairoVersion(),
    }

    const signature = await this.signer.signTransaction(calls, signerDetails)

    const calldata = transaction.fromCallsToExecuteCalldata_cairo1(calls)

    const response = await this.invokeFunction(
        { contractAddress: this.address, calldata, signature },
        {
            ...stark.v3Details(details),
            nonce: transactionsDetail.nonce,
            maxFee: 0n,
            version,
        },
    )

    return response
}
