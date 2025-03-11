import type {Manifest} from "@dojoengine/core"
import {
    type App,
    createDialog,
    type Interaction,
    NAMESPACE,
    type Param,
    type Pixel,
    type Position,
} from "@pixelaw/core"
import type {DojoEngine} from "./DojoEngine.ts"
import type {DojoWallet} from "./DojoWallet.ts"
import generateDojoCall from "./interaction/generateDojoCall.ts"
import {
    convertSnakeToPascal,
    extractParameters,
    findContract,
    findFunctionDefinition,
    prepareParams,
} from "./interaction/params.ts"

export class DojoInteraction implements Interaction {
    functionName: string
    contractName: string
    position: Position
    manifest: Manifest
    params: Param[]
    engine: DojoEngine
    color: number
    action: (params: Param[]) => void
    dialog: HTMLDialogElement | null = null

    constructor(engine: DojoEngine, app: App, pixel: Pixel | undefined, color: number) {
        // console.log(pixel)
        // Autogenerated Interaction dialog and/or actions
        this.functionName = pixel?.action ? pixel.action : "interact"
        this.contractName = `${app.name}_actions`
        this.position = { x: pixel.x, y: pixel.y }
        this.manifest = engine.dojoSetup.manifest
        this.engine = engine
        this.color = color
    }

    public static async new(
        engine: DojoEngine,
        app: App,
        pixel: Pixel | undefined,
        color: number,
    ): Promise<DojoInteraction> {
        const result = new DojoInteraction(engine, app, pixel, color)

        await result.initializeParams()
        result.initializeAction()
        result.initializeDialog()

        return result
    }

    private initializeDialog() {
        const uiParams = this.params.filter((param) => !param.systemOnly)

        if (uiParams.length) {
            this.dialog = createDialog(this.action, uiParams)
        } else {
            // No dialog, so we execute the interaction immediately
            this.action(this.params)
        }
    }
    private async initializeParams() {
        this.params = []
        const contract = findContract(this.manifest, this.contractName)
        if (!contract) return

        const functionDef = findFunctionDefinition(
            contract.abi,
            `I${convertSnakeToPascal(this.contractName)}`,
            this.functionName,
        )
        if (!functionDef) return

        const rawParams = extractParameters(functionDef)

        const params = await prepareParams(this, rawParams, contract.abi)

        this.params = params
    }

    private initializeAction() {
        // Prepare the closure to attach to the interaction
        this.action = (params) => {
            // console.log("params", params[0])

            const dojoCall = generateDojoCall(
                this.engine.dojoSetup.manifest,
                params,
                this.contractName,
                this.functionName,
                this.position,
                this.color,
            )
            const wallet = this.engine.core.getWallet() as DojoWallet
            const account = wallet.getAccount()
            this.engine.dojoSetup.provider
                .execute(account!, dojoCall, NAMESPACE, {})
                .then((res) => {
                    console.log("dojocall after exec", res)
                    // TODO animate "flickering" of the pixel that was modified?
                    // pixelStore.setPixelColor(clickedCell, hexRGBtoNumber(color))
                    // pixelStore.setCacheUpdated(Date.now())
                })
                .catch((error) => {
                    console.error("Error executing DojoCall:", error)
                    // Handle the error appropriately here
                })
        }
    }
}
