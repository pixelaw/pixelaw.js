import { generateDojoCall } from "@/dojo/utils/call.ts"
import getParamsDef from "@/dojo/utils/paramsDef.ts"
import { NAMESPACE } from "@/global/constants.js"
import { coordinateToPosition, hexRGBtoNumber } from "@/global/utils.ts"
import useWalletConnection from "@/hooks/useWalletConnection.ts"
import { usePixelawProvider } from "@/hooks/PixelawProvider.tsx"
import { useDojoAppStore } from "@/stores/DojoAppStore.ts"
import { PixelStore } from "@/stores/PixelStore"
import { useViewStateStore } from "@/stores/ViewStateStore.ts"
import type { DojoCall } from "@dojoengine/core"
import { useCallback, useEffect, useState } from "react"

export const useDojoInteractHandler = (
    onParamsRequired: (params: any) => void,
    onSubmitParams: (submitParams: (params: any) => void) => void,
) => {
    const { dojoStuff } = usePixelawProvider()
    const { setClickedCell, clickedCell, selectedApp, color } = useViewStateStore()
    const { getByName } = useDojoAppStore()
    const [paramData, setParamData] = useState(null)

    const { currentAccount } = useWalletConnection()

    // Callback to be called with submitted parameters
    const submitParams = useCallback((params: any) => {
        setParamData(params)
    }, [])

    useEffect(() => {
        // Call the passed-in callback with the submitParams function
        onSubmitParams(submitParams)
    }, [submitParams, onSubmitParams])

    useEffect(() => {
        if (!clickedCell || !selectedApp) return
        if (!dojoStuff) return
        if (!dojoStuff.manifest) {
            throw new Error("Manifest is not loaded")
        }

        console.log(`Clicked cell ${clickedCell} with app: ${selectedApp}`)

        // Retrieve info of the pixel
        const pixel = PixelStore().getPixel(clickedCell) //FIXME: DOOJO PIXEL HANNDLES FROM SUZSTAND
        console.log(pixel, dojoStuff)

        // If the pixel is not set, or the action is not overridden, use the default "interact"
        const action = pixel && pixel.action !== "0" ? pixel.action : "interact"

        const contractName = `${selectedApp}_actions`
        const position = coordinateToPosition(clickedCell)

        console.log(action, position);

        const params = getParamsDef(dojoStuff.manifest, contractName, action, position, false)
        console.log("params", params)
        if (params.length && !paramData) {
            onParamsRequired(params) // Use the callback to pass parameters where needed
            console.log("req")
            return // Stop further execution until params are handled
        }

        console.log("pd", paramData, color, hexRGBtoNumber("000000"),)
        // Generate the DojoCall
        const dojoCall: DojoCall = generateDojoCall(
            params,
            paramData,
            contractName,
            action,
            coordinateToPosition(clickedCell),
            hexRGBtoNumber(color),
        )
        console.log(dojoCall)
        // Execute the call
        dojoStuff.provider
            .execute(currentAccount!, dojoCall, NAMESPACE, {})
            .then((res) => {
                console.log("dojocall", res)

                // pixelStore.setPixelColor(clickedCell, hexRGBtoNumber(color))
                // pixelStore.setCacheUpdated(Date.now())

                // Reset paramData after execution
                setParamData(null)
            })
            .catch((error) => {
                console.error("Error executing DojoCall:", error)
                // Handle the error appropriately here
            })
        // Immediately restore state, without waiting for the txn to complete
        setClickedCell(undefined)
    }, [setClickedCell, clickedCell, paramData, color, dojoStuff, currentAccount, onParamsRequired, selectedApp])
}
