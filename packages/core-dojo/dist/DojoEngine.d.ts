import { WalletConfig, App as App$1, Interaction, Param, Engine, PixelStore, TileStore, AppStore, UpdateService, EngineStatus, Pixel as Pixel$1 } from '@pixelaw/core';
import ControllerConnector from '@cartridge/connector/controller';
import { Manifest, DojoProvider } from '@dojoengine/core';
import { BurnerConnector } from '@dojoengine/create-burner';
import { SchemaType as SchemaType$1, SDK } from '@dojoengine/sdk';
import { BigNumberish, Account } from 'starknet';

interface DojoConfig {
    serverUrl: string;
    rpcUrl: string;
    toriiUrl: string;
    relayUrl: string;
    feeTokenAddress: string;
    wallets: {
        burner?: WalletConfig;
        controller?: WalletConfig;
    };
    world: string;
}

interface App {
    fieldOrder: string[];
    system: string;
    name: BigNumberish;
    icon: BigNumberish;
    action: BigNumberish;
}
interface AppValue {
    fieldOrder: string[];
    name: BigNumberish;
    icon: BigNumberish;
    action: BigNumberish;
}
interface AppName {
    fieldOrder: string[];
    name: BigNumberish;
    system: string;
}
interface AppNameValue {
    fieldOrder: string[];
    system: string;
}
interface AppUser {
    fieldOrder: string[];
    system: string;
    player: string;
    action: BigNumberish;
}
interface AppUserValue {
    fieldOrder: string[];
    action: BigNumberish;
}
interface AreaValue {
    fieldOrder: string[];
    app: string;
    owner: string;
    color: BigNumberish;
}
interface Area {
    fieldOrder: string[];
    id: BigNumberish;
    app: string;
    owner: string;
    color: BigNumberish;
}
interface CoreActionsAddress {
    fieldOrder: string[];
    key: BigNumberish;
    value: string;
}
interface CoreActionsAddressValue {
    fieldOrder: string[];
    value: string;
}
interface Pixel {
    fieldOrder: string[];
    x: BigNumberish;
    y: BigNumberish;
    app: string;
    color: BigNumberish;
    created_at: BigNumberish;
    updated_at: BigNumberish;
    timestamp: BigNumberish;
    owner: string;
    text: BigNumberish;
    action: BigNumberish;
}
interface PixelValue {
    fieldOrder: string[];
    app: string;
    color: BigNumberish;
    created_at: BigNumberish;
    updated_at: BigNumberish;
    timestamp: BigNumberish;
    owner: string;
    text: BigNumberish;
    action: BigNumberish;
}
interface QueueItem {
    fieldOrder: string[];
    id: BigNumberish;
    valid: boolean;
}
interface QueueItemValue {
    fieldOrder: string[];
    valid: boolean;
}
interface RTree {
    fieldOrder: string[];
    id: BigNumberish;
    children: BigNumberish;
}
interface RTreeValue {
    fieldOrder: string[];
    children: BigNumberish;
}
interface Snake {
    fieldOrder: string[];
    owner: string;
    length: BigNumberish;
    first_segment_id: BigNumberish;
    last_segment_id: BigNumberish;
    direction: Direction;
    color: BigNumberish;
    text: BigNumberish;
    is_dying: boolean;
}
interface SnakeValue {
    fieldOrder: string[];
    length: BigNumberish;
    first_segment_id: BigNumberish;
    last_segment_id: BigNumberish;
    direction: Direction;
    color: BigNumberish;
    text: BigNumberish;
    is_dying: boolean;
}
interface SnakeSegmentValue {
    fieldOrder: string[];
    previous_id: BigNumberish;
    next_id: BigNumberish;
    x: BigNumberish;
    y: BigNumberish;
    pixel_original_color: BigNumberish;
    pixel_original_text: BigNumberish;
    pixel_original_app: string;
}
interface SnakeSegment {
    fieldOrder: string[];
    id: BigNumberish;
    previous_id: BigNumberish;
    next_id: BigNumberish;
    x: BigNumberish;
    y: BigNumberish;
    pixel_original_color: BigNumberish;
    pixel_original_text: BigNumberish;
    pixel_original_app: string;
}
declare enum Direction {
    None = 0,
    Left = 1,
    Right = 2,
    Up = 3,
    Down = 4
}
interface SchemaType extends SchemaType$1 {
    pixelaw: {
        App: App;
        AppValue: AppValue;
        AppName: AppName;
        AppNameValue: AppNameValue;
        AppUser: AppUser;
        AppUserValue: AppUserValue;
        AreaValue: AreaValue;
        Area: Area;
        CoreActionsAddress: CoreActionsAddress;
        CoreActionsAddressValue: CoreActionsAddressValue;
        Pixel: Pixel;
        PixelValue: PixelValue;
        QueueItem: QueueItem;
        QueueItemValue: QueueItemValue;
        RTree: RTree;
        RTreeValue: RTreeValue;
        Snake: Snake;
        SnakeValue: SnakeValue;
        SnakeSegmentValue: SnakeSegmentValue;
        SnakeSegment: SnakeSegment;
    };
}

type DojoStuff = {
    apps: App$1[];
    manifest: Manifest | null;
    controllerConnector: ControllerConnector | null;
    burnerConnector: BurnerConnector | null;
    sdk: SDK<SchemaType> | null;
    provider: DojoProvider;
};

declare class DojoInteraction implements Interaction {
    action: (params: Param[]) => void;
    dialog: HTMLDialogElement | null;
}

declare class DojoEngine implements Engine {
    pixelStore: PixelStore;
    tileStore: TileStore;
    appStore: AppStore;
    updateService: UpdateService;
    status: EngineStatus;
    config: DojoConfig;
    dojoSetup: DojoStuff | null;
    account: Account | null;
    init(config: DojoConfig): Promise<void>;
    handleInteraction(app: App$1, pixel: Pixel$1, color: number): DojoInteraction;
}

export { DojoEngine };
