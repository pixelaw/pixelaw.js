import type {Param} from "./types.ts"

function formElementForParam(param: Param): HTMLElement {
    switch (param.type) {
        case "string":
            return createStringInput(param)
        case "number":
            return createNumberInput(param)
        case "enum":
            return createEnumSelect(param)
        default:
            throw new Error(`Unsupported type: ${param.type}`)
    }
}
export function createDialog(action, params: Param[]): HTMLDialogElement {
    const dialog = document.createElement("dialog")
    dialog.className = "dialog"

    const form = document.createElement("form")
    form.method = "dialog"
    form.className = "form"

    for (const param of params) {
        console.log(param)
        if (param.systemOnly) continue
        const label = document.createElement("label")
        label.textContent = param.name
        label.className = "label"

        const inputElement = formElementForParam(param)

        form.appendChild(label)
        form.appendChild(inputElement)
    }

    form.appendChild(document.createElement("br"))

    const okButton = document.createElement("button")
    okButton.type = "submit"
    okButton.textContent = "OK"
    okButton.className = "button ok-button"
    okButton.onclick = async (event) => {
        event.preventDefault() // Prevent form submission so we can process with js
        const formData = new FormData(form)
        for (const p of params) {
            p.value = Number.parseInt(formData.get(p.name).toString())

            // Call the transformer if it's there. This will ensure params are ready for submission to chain.
            if (p.transformer) await p.transformer()
        }
        action(params)
        dialog.close()
    }
    form.appendChild(okButton)

    const cancelButton = document.createElement("button")
    cancelButton.type = "button"
    cancelButton.textContent = "Cancel"
    cancelButton.className = "button cancel-button"
    cancelButton.onclick = () => dialog.close()
    form.appendChild(cancelButton)

    dialog.appendChild(form)

    return dialog
}
function createStringInput(param: Param): HTMLInputElement {
    const input = document.createElement("input")
    input.type = "text"
    input.name = param.name
    input.className = "string-input"
    return input
}

function createNumberInput(param: Param): HTMLInputElement {
    const input = document.createElement("input")
    input.type = "number"
    input.name = param.name
    input.className = "number-input"
    if (param.value !== null && typeof param.value === "number") {
        input.value = param.value.toString()
    }
    return input
}

function createEnumSelect(param: Param): HTMLSelectElement {
    const select = document.createElement("select")
    select.name = param.name
    select.className = "enum-select"

    for (const variant of param.variants) {
        const option = document.createElement("option")
        option.value = variant.value.toString()
        option.textContent = variant.name
        select.appendChild(option)
    }

    return select
}
