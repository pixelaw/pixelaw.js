import type { Manifest } from "@dojoengine/core"
import {
    type App,
    type Interaction,
    NAMESPACE,
    type Pixel,
    type Position,
    type InteractParams,
    type InteractParam,
} from "@pixelaw/core"
import type { DojoEngine } from "./DojoEngine.ts"
import type { DojoWallet } from "./DojoWallet.ts"
import generateDojoCall from "./interaction/generateDojoCall.ts"
import {
    convertSnakeToPascal,
    extractParameters,
    findContract,
    findFunctionDefinition,
    prepareParams,
} from "./interaction/params.ts"

export class DojoInteraction implements Interaction {
    private functionName: string
    private contractName: string
    private position: Position
    private manifest: Manifest
    private params: InteractParams = []
    private engine: DojoEngine
    private color: number
    private action!: (params: InteractParams) => void

    constructor(engine: DojoEngine, app: App, pixel: Pixel | undefined, color: number) {
        this.functionName = pixel?.action && pixel.action.length > 0 ? pixel.action : "interact"
        this.contractName = `${app.name}_actions`
        this.position = { x: pixel?.x ?? 0, y: pixel?.y ?? 0 }
        this.manifest = engine.dojoSetup.manifest
        this.engine = engine
        this.color = color
    }

    public static async create(
        engine: DojoEngine,
        app: App,
        pixel: Pixel | undefined,
        color: number,
    ): Promise<DojoInteraction> {
        const instance = new DojoInteraction(engine, app, pixel, color)
        await instance.initializeParams()
        instance.initializeAction()
        return instance
    }

    public setUserParam(name: string, value: string | number): void {
        const param = this.params.find((item: InteractParam) => item.name === name && !item.systemOnly)
        if (param) {
            param.value = value
        } else {
            console.warn(`Parameter with name ${name} not found or is system-only.`)
        }
    }

    public getUserParams(): InteractParams {
        // return array of params that are NOT systemOnly
        return this.params.filter((item: InteractParam) => !item.systemOnly)
    }

    public async execute(): Promise<void> {
        // Run the transformer on each param
        await Promise.all(
            this.params.map(async (param) => {
                if (param.transformer) await param.transformer()
            }),
        )

        // Execute the action
        await this.action(this.params)
    }

    private async initializeParams(): Promise<void> {
        const contract = findContract(this.manifest, this.contractName)
        if (!contract) return

        const functionDef = findFunctionDefinition(
            contract.abi,
            `I${convertSnakeToPascal(this.contractName)}`,
            this.functionName,
        )
        if (!functionDef) return

        const rawParams = extractParameters(functionDef)
        this.params = await prepareParams(this, rawParams, contract.abi)
    }

    private initializeAction(): void {
        this.action = async (params) => {
            console.info(params, this.contractName, this.functionName, this.position, this.color)
            try {
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
                const res = await this.engine.dojoSetup.provider.execute(account!, dojoCall, NAMESPACE, {})
                console.log("tx", res)
                // TODO: Implement pixel flickering animation
            } catch (error) {
                console.error("Error executing DojoCall:", error)
            }
        }
    }
}
