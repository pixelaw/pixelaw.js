import type { Pixel } from "../generated/models.gen"

export enum Active_Page {
    Home = 0,
    Network = 1,
    Lobby = 2,
    Gameplay = 3,
}

export type MainLayoutType = {
    setHasNavbar: React.Dispatch<React.SetStateAction<boolean>>
    setHasBackgroundImage: React.Dispatch<React.SetStateAction<boolean>>
    setHasBackgroundOverlay: React.Dispatch<React.SetStateAction<boolean>>
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export type Account = {
    address: string
    active: boolean
}

export type PositionWithAddressAndType = {
    x: number | undefined
    y: number | undefined
    address?: string | number
    pixel?: string | number
}

export type NotificationDataType = {
    x: number
    y: number
    pixelType?: string | number
}

export type TPackedSQLPixel = {
    t: string
    v: number
    c: string
}

export type TPixel = Omit<Pixel, "created_at" | "updated_at" | "timestamp">

/// Manifest types
type ImplType = {
    type: "impl"
    name: string
    interface_name: string
}

type BaseType = {
    name: string
    type: string
}

type FunctionType = {
    type: "function"
    name: string
    inputs: BaseType[]
    outputs: { type: string }[]
    state_mutability: "external" | "view"
}

export type InterfaceType = {
    type: "interface"
    name: string
    items: FunctionType[]
}

type StructType = {
    type: "struct"
    name: string
    members: BaseType[]
}

export type EnumType = {
    type: "enum"
    name: string
    variants: BaseType[]
}

type EventMember = {
    name: string
    type: string
    kind: string
}

type EventStructType = {
    type: "event"
    name: string
    kind: "struct"
    members: EventMember[]
}

type EventEnumType = {
    type: "event"
    name: string
    kind: "enum"
    variants: EventMember[]
}

export type AbiType = (
    | ImplType
    | InterfaceType
    | StructType
    | EnumType
    | FunctionType
    | EventStructType
    | EventEnumType
)[]

type ComputedValueEntryPoint = {
    contract: string
    entrypoint: string
    model?: string
}

type Contract = {
    name: string
    address?: string
    class_hash: string
    abi: AbiType
    reads: string[]
    writes: string[]
    computed: ComputedValueEntryPoint[]
}

type Class = {
    name: string
    class_hash: string
    abi: AbiType
}

type Member = {
    name: string
    type: string
    key: boolean
}

type Model = {
    name: string
    members: Member[]
    class_hash: string
    abi: AbiType
}

// export type Manifest = {
//     world: Contract
//     executor: Contract
//     base: Class
//     contracts: Contract[]
//     models: Model[]
// }
