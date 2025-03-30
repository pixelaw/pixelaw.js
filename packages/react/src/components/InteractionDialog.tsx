import type React from "react"
import type { Interaction, InteractParam } from "@pixelaw/core"
// import { dialog, overlay } from "./InteractionDialog.module.css"

export interface InteractionDialogProps {
    interaction: Interaction
    onSubmit: (interaction: Interaction) => void
    onCancel: (interaction: Interaction) => void
}

export const InteractionDialog: React.FC<InteractionDialogProps> = ({ interaction, onSubmit, onCancel }) => {
    const params = interaction.getUserParams()

    const handleCancel = () => onCancel(interaction)

    const handleSubmit = async () => {
        await interaction.execute()
        onSubmit(interaction)
    }

    const renderInput = (param: InteractParam) => {
        const commonProps = {
            value: param.value || "",
        }
        if (param.type === "enum" && !param.value && param.variants.length > 0) {
            // Set the initial value for the enum if not already set
            interaction.setUserParam(param.name, param.variants[0].value)
        }
        switch (param.type) {
            case "string":
                return <input type="text" {...commonProps} />
            case "number":
                return (
                    <input
                        type="number"
                        {...commonProps}
                        onChange={(e) => interaction.setUserParam(param.name, Number.parseInt(e.target.value))}
                    />
                )
            case "enum":
                return (
                    <select
                        {...commonProps}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                            interaction.setUserParam(param.name, e.target.value)
                        }
                    >
                        {param.variants.map((variant) => (
                            <option key={variant.value} value={variant.value}>
                                {variant.name}
                            </option>
                        ))}
                    </select>
                )
            default:
                return null
        }
    }

    return (
        <div className="overlay">
            <form
                className="dialog"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                }}
            >
                {params.map((param) => (
                    <div key={param.name}>
                        {/* biome-ignore lint/a11y/noLabelWithoutControl: Label is wrapping values, so implemented correctly */}
                        <label>
                            {param.name}
                            {renderInput(param)}
                        </label>
                    </div>
                ))}
                <button type="button" onClick={handleCancel}>
                    Cancel
                </button>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
