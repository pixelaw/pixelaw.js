import type { SchemaType as ISchemaType } from "@dojoengine/sdk"

import { CairoCustomEnum, CairoOption, CairoOptionVariant, type BigNumberish } from "starknet"

// Type definition for `pixelaw::apps::player::Player` struct
export interface Player {
    owner: string
    name: BigNumberish
    emoji: BigNumberish
    position: Position
    color: BigNumberish
    pixel_original_color: BigNumberish
    pixel_original_app: string
    pixel_original_text: BigNumberish
    pixel_original_action: BigNumberish
}

// Type definition for `pixelaw::apps::player::PlayerValue` struct
export interface PlayerValue {
    name: BigNumberish
    emoji: BigNumberish
    position: Position
    color: BigNumberish
    pixel_original_color: BigNumberish
    pixel_original_app: string
    pixel_original_text: BigNumberish
    pixel_original_action: BigNumberish
}

// Type definition for `pixelaw::apps::player::PositionPlayer` struct
export interface PositionPlayer {
    position: Position
    player: string
}

// Type definition for `pixelaw::apps::player::PositionPlayerValue` struct
export interface PositionPlayerValue {
    player: string
}

// Type definition for `pixelaw::apps::snake::Snake` struct
export interface Snake {
    owner: string
    length: BigNumberish
    first_segment_id: BigNumberish
    last_segment_id: BigNumberish
    direction: DirectionEnum
    color: BigNumberish
    text: BigNumberish
    is_dying: boolean
}

// Type definition for `pixelaw::apps::snake::SnakeSegment` struct
export interface SnakeSegment {
    id: BigNumberish
    previous_id: BigNumberish
    next_id: BigNumberish
    position: Position
    pixel_original_color: BigNumberish
    pixel_original_text: BigNumberish
    pixel_original_app: string
}

// Type definition for `pixelaw::apps::snake::SnakeSegmentValue` struct
export interface SnakeSegmentValue {
    previous_id: BigNumberish
    next_id: BigNumberish
    position: Position
    pixel_original_color: BigNumberish
    pixel_original_text: BigNumberish
    pixel_original_app: string
}

// Type definition for `pixelaw::apps::snake::SnakeValue` struct
export interface SnakeValue {
    length: BigNumberish
    first_segment_id: BigNumberish
    last_segment_id: BigNumberish
    direction: DirectionEnum
    color: BigNumberish
    text: BigNumberish
    is_dying: boolean
}

// Type definition for `pixelaw::core::models::area::Area` struct
export interface Area {
    id: BigNumberish
    app: string
    owner: string
    color: BigNumberish
}

// Type definition for `pixelaw::core::models::area::AreaValue` struct
export interface AreaValue {
    app: string
    owner: string
    color: BigNumberish
}

// Type definition for `pixelaw::core::models::area::RTree` struct
export interface RTree {
    id: BigNumberish
    children: BigNumberish
}

// Type definition for `pixelaw::core::models::area::RTreeValue` struct
export interface RTreeValue {
    children: BigNumberish
}

// Type definition for `pixelaw::core::models::dummy::Dummy` struct
export interface Dummy {
    id: BigNumberish
    defaultParams: DefaultParameters
    bounds: Bounds
    pixelUpdate: PixelUpdate
    emoji: Emoji
}

// Type definition for `pixelaw::core::models::dummy::DummyValue` struct
export interface DummyValue {
    defaultParams: DefaultParameters
    bounds: Bounds
    pixelUpdate: PixelUpdate
    emoji: Emoji
}

// Type definition for `pixelaw::core::models::pixel::Pixel` struct
export interface Pixel {
    position: Position
    app: string
    color: BigNumberish
    created_at: BigNumberish
    updated_at: BigNumberish
    timestamp: BigNumberish
    owner: string
    text: BigNumberish
    action: BigNumberish
}

// Type definition for `pixelaw::core::models::pixel::PixelUpdate` struct
export interface PixelUpdate {
    position: Position
    color: CairoOption<BigNumberish>
    owner: CairoOption<string>
    app: CairoOption<string>
    text: CairoOption<BigNumberish>
    timestamp: CairoOption<BigNumberish>
    action: CairoOption<BigNumberish>
}

// Type definition for `pixelaw::core::models::pixel::PixelValue` struct
export interface PixelValue {
    app: string
    color: BigNumberish
    created_at: BigNumberish
    updated_at: BigNumberish
    timestamp: BigNumberish
    owner: string
    text: BigNumberish
    action: BigNumberish
}

// Type definition for `pixelaw::core::models::queue::QueueItem` struct
export interface QueueItem {
    id: BigNumberish
    valid: boolean
}

// Type definition for `pixelaw::core::models::queue::QueueItemValue` struct
export interface QueueItemValue {
    valid: boolean
}

// Type definition for `pixelaw::core::models::registry::App` struct
export interface App {
    system: string
    name: BigNumberish
    icon: BigNumberish
    action: BigNumberish
}

// Type definition for `pixelaw::core::models::registry::AppName` struct
export interface AppName {
    name: BigNumberish
    system: string
}

// Type definition for `pixelaw::core::models::registry::AppNameValue` struct
export interface AppNameValue {
    system: string
}

// Type definition for `pixelaw::core::models::registry::AppUser` struct
export interface AppUser {
    system: string
    player: string
    action: BigNumberish
}

// Type definition for `pixelaw::core::models::registry::AppUserValue` struct
export interface AppUserValue {
    action: BigNumberish
}

// Type definition for `pixelaw::core::models::registry::AppValue` struct
export interface AppValue {
    name: BigNumberish
    icon: BigNumberish
    action: BigNumberish
}

// Type definition for `pixelaw::core::models::registry::CoreActionsAddress` struct
export interface CoreActionsAddress {
    key: BigNumberish
    value: string
}

// Type definition for `pixelaw::core::models::registry::CoreActionsAddressValue` struct
export interface CoreActionsAddressValue {
    value: string
}

// Type definition for `pixelaw::core::utils::Bounds` struct
export interface Bounds {
    x_min: BigNumberish
    y_min: BigNumberish
    x_max: BigNumberish
    y_max: BigNumberish
}

// Type definition for `pixelaw::core::utils::DefaultParameters` struct
export interface DefaultParameters {
    player_override: CairoOption<string>
    system_override: CairoOption<string>
    area_hint: CairoOption<BigNumberish>
    position: Position
    color: BigNumberish
}

// Type definition for `pixelaw::core::utils::Emoji` struct
export interface Emoji {
    value: BigNumberish
}

// Type definition for `pixelaw::core::utils::Position` struct
export interface Position {
    x: BigNumberish
    y: BigNumberish
}

// Type definition for `pixelaw::core::events::Notification` struct
export interface Notification {
    position: Position
    app: string
    color: BigNumberish
    from: CairoOption<string>
    to: CairoOption<string>
    text: BigNumberish
}

// Type definition for `pixelaw::core::events::NotificationValue` struct
export interface NotificationValue {
    app: string
    color: BigNumberish
    from: CairoOption<string>
    to: CairoOption<string>
    text: BigNumberish
}

// Type definition for `pixelaw::core::events::QueueScheduled` struct
export interface QueueScheduled {
    id: BigNumberish
    timestamp: BigNumberish
    called_system: string
    selector: BigNumberish
    calldata: Array<BigNumberish>
}

// Type definition for `pixelaw::core::events::QueueScheduledValue` struct
export interface QueueScheduledValue {
    timestamp: BigNumberish
    called_system: string
    selector: BigNumberish
    calldata: Array<BigNumberish>
}

// Type definition for `pixelaw::core::utils::Direction` enum
export const direction = ["None", "Left", "Right", "Up", "Down"] as const
export type Direction = { [key in (typeof direction)[number]]: string }
export type DirectionEnum = CairoCustomEnum

export interface SchemaType extends ISchemaType {
    pixelaw: {
        Player: Player
        PlayerValue: PlayerValue
        PositionPlayer: PositionPlayer
        PositionPlayerValue: PositionPlayerValue
        Snake: Snake
        SnakeSegment: SnakeSegment
        SnakeSegmentValue: SnakeSegmentValue
        SnakeValue: SnakeValue
        Area: Area
        AreaValue: AreaValue
        RTree: RTree
        RTreeValue: RTreeValue
        Dummy: Dummy
        DummyValue: DummyValue
        Pixel: Pixel
        PixelUpdate: PixelUpdate
        PixelValue: PixelValue
        QueueItem: QueueItem
        QueueItemValue: QueueItemValue
        App: App
        AppName: AppName
        AppNameValue: AppNameValue
        AppUser: AppUser
        AppUserValue: AppUserValue
        AppValue: AppValue
        CoreActionsAddress: CoreActionsAddress
        CoreActionsAddressValue: CoreActionsAddressValue
        Bounds: Bounds
        DefaultParameters: DefaultParameters
        Emoji: Emoji
        Position: Position
        Notification: Notification
        NotificationValue: NotificationValue
        QueueScheduled: QueueScheduled
        QueueScheduledValue: QueueScheduledValue
    }
}
export const schema: SchemaType = {
    pixelaw: {
        Player: {
            owner: "",
            name: 0,
            emoji: 0,
            position: { x: 0, y: 0 },
            color: 0,
            pixel_original_color: 0,
            pixel_original_app: "",
            pixel_original_text: 0,
            pixel_original_action: 0,
        },
        PlayerValue: {
            name: 0,
            emoji: 0,
            position: { x: 0, y: 0 },
            color: 0,
            pixel_original_color: 0,
            pixel_original_app: "",
            pixel_original_text: 0,
            pixel_original_action: 0,
        },
        PositionPlayer: {
            position: { x: 0, y: 0 },
            player: "",
        },
        PositionPlayerValue: {
            player: "",
        },
        Snake: {
            owner: "",
            length: 0,
            first_segment_id: 0,
            last_segment_id: 0,
            direction: new CairoCustomEnum({
                None: "",
                Left: undefined,
                Right: undefined,
                Up: undefined,
                Down: undefined,
            }),
            color: 0,
            text: 0,
            is_dying: false,
        },
        SnakeSegment: {
            id: 0,
            previous_id: 0,
            next_id: 0,
            position: { x: 0, y: 0 },
            pixel_original_color: 0,
            pixel_original_text: 0,
            pixel_original_app: "",
        },
        SnakeSegmentValue: {
            previous_id: 0,
            next_id: 0,
            position: { x: 0, y: 0 },
            pixel_original_color: 0,
            pixel_original_text: 0,
            pixel_original_app: "",
        },
        SnakeValue: {
            length: 0,
            first_segment_id: 0,
            last_segment_id: 0,
            direction: new CairoCustomEnum({
                None: "",
                Left: undefined,
                Right: undefined,
                Up: undefined,
                Down: undefined,
            }),
            color: 0,
            text: 0,
            is_dying: false,
        },
        Area: {
            id: 0,
            app: "",
            owner: "",
            color: 0,
        },
        AreaValue: {
            app: "",
            owner: "",
            color: 0,
        },
        RTree: {
            id: 0,
            children: 0,
        },
        RTreeValue: {
            children: 0,
        },
        Dummy: {
            id: 0,
            defaultParams: {
                player_override: new CairoOption(CairoOptionVariant.None),
                system_override: new CairoOption(CairoOptionVariant.None),
                area_hint: new CairoOption(CairoOptionVariant.None),
                position: { x: 0, y: 0 },
                color: 0,
            },
            bounds: { x_min: 0, y_min: 0, x_max: 0, y_max: 0 },
            pixelUpdate: {
                position: { x: 0, y: 0 },
                color: new CairoOption(CairoOptionVariant.None),
                owner: new CairoOption(CairoOptionVariant.None),
                app: new CairoOption(CairoOptionVariant.None),
                text: new CairoOption(CairoOptionVariant.None),
                timestamp: new CairoOption(CairoOptionVariant.None),
                action: new CairoOption(CairoOptionVariant.None),
            },
            emoji: { value: 0 },
        },
        DummyValue: {
            defaultParams: {
                player_override: new CairoOption(CairoOptionVariant.None),
                system_override: new CairoOption(CairoOptionVariant.None),
                area_hint: new CairoOption(CairoOptionVariant.None),
                position: { x: 0, y: 0 },
                color: 0,
            },
            bounds: { x_min: 0, y_min: 0, x_max: 0, y_max: 0 },
            pixelUpdate: {
                position: { x: 0, y: 0 },
                color: new CairoOption(CairoOptionVariant.None),
                owner: new CairoOption(CairoOptionVariant.None),
                app: new CairoOption(CairoOptionVariant.None),
                text: new CairoOption(CairoOptionVariant.None),
                timestamp: new CairoOption(CairoOptionVariant.None),
                action: new CairoOption(CairoOptionVariant.None),
            },
            emoji: { value: 0 },
        },
        Pixel: {
            position: { x: 0, y: 0 },
            app: "",
            color: 0,
            created_at: 0,
            updated_at: 0,
            timestamp: 0,
            owner: "",
            text: 0,
            action: 0,
        },
        PixelUpdate: {
            position: { x: 0, y: 0 },
            color: new CairoOption(CairoOptionVariant.None),
            owner: new CairoOption(CairoOptionVariant.None),
            app: new CairoOption(CairoOptionVariant.None),
            text: new CairoOption(CairoOptionVariant.None),
            timestamp: new CairoOption(CairoOptionVariant.None),
            action: new CairoOption(CairoOptionVariant.None),
        },
        PixelValue: {
            app: "",
            color: 0,
            created_at: 0,
            updated_at: 0,
            timestamp: 0,
            owner: "",
            text: 0,
            action: 0,
        },
        QueueItem: {
            id: 0,
            valid: false,
        },
        QueueItemValue: {
            valid: false,
        },
        App: {
            system: "",
            name: 0,
            icon: 0,
            action: 0,
        },
        AppName: {
            name: 0,
            system: "",
        },
        AppNameValue: {
            system: "",
        },
        AppUser: {
            system: "",
            player: "",
            action: 0,
        },
        AppUserValue: {
            action: 0,
        },
        AppValue: {
            name: 0,
            icon: 0,
            action: 0,
        },
        CoreActionsAddress: {
            key: 0,
            value: "",
        },
        CoreActionsAddressValue: {
            value: "",
        },
        Bounds: {
            x_min: 0,
            y_min: 0,
            x_max: 0,
            y_max: 0,
        },
        DefaultParameters: {
            player_override: new CairoOption(CairoOptionVariant.None),
            system_override: new CairoOption(CairoOptionVariant.None),
            area_hint: new CairoOption(CairoOptionVariant.None),
            position: { x: 0, y: 0 },
            color: 0,
        },
        Emoji: {
            value: 0,
        },
        Position: {
            x: 0,
            y: 0,
        },
        Notification: {
            position: { x: 0, y: 0 },
            app: "",
            color: 0,
            from: new CairoOption(CairoOptionVariant.None),
            to: new CairoOption(CairoOptionVariant.None),
            text: 0,
        },
        NotificationValue: {
            app: "",
            color: 0,
            from: new CairoOption(CairoOptionVariant.None),
            to: new CairoOption(CairoOptionVariant.None),
            text: 0,
        },
        QueueScheduled: {
            id: 0,
            timestamp: 0,
            called_system: "",
            selector: 0,
            calldata: [0],
        },
        QueueScheduledValue: {
            timestamp: 0,
            called_system: "",
            selector: 0,
            calldata: [0],
        },
    },
}
export enum ModelsMapping {
    Player = "pixelaw-Player",
    PlayerValue = "pixelaw-PlayerValue",
    PositionPlayer = "pixelaw-PositionPlayer",
    PositionPlayerValue = "pixelaw-PositionPlayerValue",
    Snake = "pixelaw-Snake",
    SnakeSegment = "pixelaw-SnakeSegment",
    SnakeSegmentValue = "pixelaw-SnakeSegmentValue",
    SnakeValue = "pixelaw-SnakeValue",
    Area = "pixelaw-Area",
    AreaValue = "pixelaw-AreaValue",
    RTree = "pixelaw-RTree",
    RTreeValue = "pixelaw-RTreeValue",
    Dummy = "pixelaw-Dummy",
    DummyValue = "pixelaw-DummyValue",
    Pixel = "pixelaw-Pixel",
    PixelUpdate = "pixelaw-PixelUpdate",
    PixelValue = "pixelaw-PixelValue",
    QueueItem = "pixelaw-QueueItem",
    QueueItemValue = "pixelaw-QueueItemValue",
    App = "pixelaw-App",
    AppName = "pixelaw-AppName",
    AppNameValue = "pixelaw-AppNameValue",
    AppUser = "pixelaw-AppUser",
    AppUserValue = "pixelaw-AppUserValue",
    AppValue = "pixelaw-AppValue",
    CoreActionsAddress = "pixelaw-CoreActionsAddress",
    CoreActionsAddressValue = "pixelaw-CoreActionsAddressValue",
    Bounds = "pixelaw-Bounds",
    DefaultParameters = "pixelaw-DefaultParameters",
    Direction = "pixelaw-Direction",
    Emoji = "pixelaw-Emoji",
    Position = "pixelaw-Position",
    Notification = "pixelaw-Notification",
    NotificationValue = "pixelaw-NotificationValue",
    QueueScheduled = "pixelaw-QueueScheduled",
    QueueScheduledValue = "pixelaw-QueueScheduledValue",
}
