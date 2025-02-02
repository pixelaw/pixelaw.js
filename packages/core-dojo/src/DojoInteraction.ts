import type { Interaction, Param } from "@pixelaw/core"

export class DojoInteraction implements Interaction {
    action: (params: Param[]) => void
    dialog: HTMLDialogElement | null = null
}
