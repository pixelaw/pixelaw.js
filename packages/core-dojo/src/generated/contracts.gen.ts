import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_actions_addArea_calldata = (bounds: models.Bounds, owner: string, color: BigNumberish, app: string): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "add_area",
			calldata: [bounds, owner, color, app],
		};
	};

	const actions_addArea = async (snAccount: Account | AccountInterface, bounds: models.Bounds, owner: string, color: BigNumberish, app: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_addArea_calldata(bounds, owner, color, app),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_alertPlayer_calldata = (position: models.Position, player: string, message: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "alert_player",
			calldata: [position, player, message],
		};
	};

	const actions_alertPlayer = async (snAccount: Account | AccountInterface, position: models.Position, player: string, message: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_alertPlayer_calldata(position, player, message),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_canUpdatePixel_calldata = (forPlayer: string, forSystem: string, pixel: models.Pixel, pixelUpdate: models.PixelUpdate, areaIdHint: CairoOption<BigNumberish>, allowModify: boolean): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "can_update_pixel",
			calldata: [forPlayer, forSystem, pixel, pixelUpdate, areaIdHint, allowModify],
		};
	};

	const actions_canUpdatePixel = async (snAccount: Account | AccountInterface, forPlayer: string, forSystem: string, pixel: models.Pixel, pixelUpdate: models.PixelUpdate, areaIdHint: CairoOption<BigNumberish>, allowModify: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_canUpdatePixel_calldata(forPlayer, forSystem, pixel, pixelUpdate, areaIdHint, allowModify),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_findAreaByPosition_calldata = (position: models.Position): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "find_area_by_position",
			calldata: [position],
		};
	};

	const actions_findAreaByPosition = async (snAccount: Account | AccountInterface, position: models.Position) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_findAreaByPosition_calldata(position),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_findAreasInsideBounds_calldata = (bounds: models.Bounds): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "find_areas_inside_bounds",
			calldata: [bounds],
		};
	};

	const actions_findAreasInsideBounds = async (snAccount: Account | AccountInterface, bounds: models.Bounds) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_findAreasInsideBounds_calldata(bounds),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_init_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "init",
			calldata: [],
		};
	};

	const actions_init = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_init_calldata(),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_newApp_calldata = (system: string, name: BigNumberish, icon: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "new_app",
			calldata: [system, name, icon],
		};
	};

	const actions_newApp = async (snAccount: Account | AccountInterface, system: string, name: BigNumberish, icon: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_newApp_calldata(system, name, icon),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_processQueue_calldata = (id: BigNumberish, timestamp: BigNumberish, calledSystem: string, selector: BigNumberish, calldata: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "process_queue",
			calldata: [id, timestamp, calledSystem, selector, calldata],
		};
	};

	const actions_processQueue = async (snAccount: Account | AccountInterface, id: BigNumberish, timestamp: BigNumberish, calledSystem: string, selector: BigNumberish, calldata: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_processQueue_calldata(id, timestamp, calledSystem, selector, calldata),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_removeArea_calldata = (areaId: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "remove_area",
			calldata: [areaId],
		};
	};

	const actions_removeArea = async (snAccount: Account | AccountInterface, areaId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_removeArea_calldata(areaId),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_scheduleQueue_calldata = (timestamp: BigNumberish, calledSystem: string, selector: BigNumberish, calldata: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "schedule_queue",
			calldata: [timestamp, calledSystem, selector, calldata],
		};
	};

	const actions_scheduleQueue = async (snAccount: Account | AccountInterface, timestamp: BigNumberish, calledSystem: string, selector: BigNumberish, calldata: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_scheduleQueue_calldata(timestamp, calledSystem, selector, calldata),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_updatePixel_calldata = (forPlayer: string, forSystem: string, pixelUpdate: models.PixelUpdate, areaId: CairoOption<BigNumberish>, allowModify: boolean): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "update_pixel",
			calldata: [forPlayer, forSystem, pixelUpdate, areaId, allowModify],
		};
	};

	const actions_updatePixel = async (snAccount: Account | AccountInterface, forPlayer: string, forSystem: string, pixelUpdate: models.PixelUpdate, areaId: CairoOption<BigNumberish>, allowModify: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_updatePixel_calldata(forPlayer, forSystem, pixelUpdate, areaId, allowModify),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_paint_actions_fade_calldata = (defaultParams: models.DefaultParameters): DojoCall => {
		return {
			contractName: "paint_actions",
			entrypoint: "fade",
			calldata: [defaultParams],
		};
	};

	const paint_actions_fade = async (snAccount: Account | AccountInterface, defaultParams: models.DefaultParameters) => {
		try {
			return await provider.execute(
				snAccount,
				build_paint_actions_fade_calldata(defaultParams),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_paint_actions_init_calldata = (): DojoCall => {
		return {
			contractName: "paint_actions",
			entrypoint: "init",
			calldata: [],
		};
	};

	const paint_actions_init = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_paint_actions_init_calldata(),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_paint_actions_interact_calldata = (defaultParams: models.DefaultParameters): DojoCall => {
		return {
			contractName: "paint_actions",
			entrypoint: "interact",
			calldata: [defaultParams],
		};
	};

	const paint_actions_interact = async (snAccount: Account | AccountInterface, defaultParams: models.DefaultParameters) => {
		try {
			return await provider.execute(
				snAccount,
				build_paint_actions_interact_calldata(defaultParams),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_paint_actions_onPostUpdate_calldata = (pixelUpdate: models.PixelUpdate, appCaller: models.App, playerCaller: string): DojoCall => {
		return {
			contractName: "paint_actions",
			entrypoint: "on_post_update",
			calldata: [pixelUpdate, appCaller, playerCaller],
		};
	};

	const paint_actions_onPostUpdate = async (snAccount: Account | AccountInterface, pixelUpdate: models.PixelUpdate, appCaller: models.App, playerCaller: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_paint_actions_onPostUpdate_calldata(pixelUpdate, appCaller, playerCaller),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_paint_actions_onPreUpdate_calldata = (pixelUpdate: models.PixelUpdate, appCaller: models.App, playerCaller: string): DojoCall => {
		return {
			contractName: "paint_actions",
			entrypoint: "on_pre_update",
			calldata: [pixelUpdate, appCaller, playerCaller],
		};
	};

	const paint_actions_onPreUpdate = async (snAccount: Account | AccountInterface, pixelUpdate: models.PixelUpdate, appCaller: models.App, playerCaller: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_paint_actions_onPreUpdate_calldata(pixelUpdate, appCaller, playerCaller),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_paint_actions_pixelRow_calldata = (defaultParams: models.DefaultParameters, imageData: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "paint_actions",
			entrypoint: "pixel_row",
			calldata: [defaultParams, imageData],
		};
	};

	const paint_actions_pixelRow = async (snAccount: Account | AccountInterface, defaultParams: models.DefaultParameters, imageData: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_paint_actions_pixelRow_calldata(defaultParams, imageData),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_paint_actions_putColor_calldata = (defaultParams: models.DefaultParameters): DojoCall => {
		return {
			contractName: "paint_actions",
			entrypoint: "put_color",
			calldata: [defaultParams],
		};
	};

	const paint_actions_putColor = async (snAccount: Account | AccountInterface, defaultParams: models.DefaultParameters) => {
		try {
			return await provider.execute(
				snAccount,
				build_paint_actions_putColor_calldata(defaultParams),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_snake_actions_init_calldata = (): DojoCall => {
		return {
			contractName: "snake_actions",
			entrypoint: "init",
			calldata: [],
		};
	};

	const snake_actions_init = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_snake_actions_init_calldata(),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_snake_actions_interact_calldata = (defaultParams: models.DefaultParameters, direction: CairoCustomEnum): DojoCall => {
		return {
			contractName: "snake_actions",
			entrypoint: "interact",
			calldata: [defaultParams, direction],
		};
	};

	const snake_actions_interact = async (snAccount: Account | AccountInterface, defaultParams: models.DefaultParameters, direction: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount,
				build_snake_actions_interact_calldata(defaultParams, direction),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_snake_actions_move_calldata = (owner: string): DojoCall => {
		return {
			contractName: "snake_actions",
			entrypoint: "move",
			calldata: [owner],
		};
	};

	const snake_actions_move = async (snAccount: Account | AccountInterface, owner: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_snake_actions_move_calldata(owner),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_snake_actions_onPostUpdate_calldata = (pixelUpdate: models.PixelUpdate, appCaller: models.App, playerCaller: string): DojoCall => {
		return {
			contractName: "snake_actions",
			entrypoint: "on_post_update",
			calldata: [pixelUpdate, appCaller, playerCaller],
		};
	};

	const snake_actions_onPostUpdate = async (snAccount: Account | AccountInterface, pixelUpdate: models.PixelUpdate, appCaller: models.App, playerCaller: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_snake_actions_onPostUpdate_calldata(pixelUpdate, appCaller, playerCaller),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_snake_actions_onPreUpdate_calldata = (pixelUpdate: models.PixelUpdate, appCaller: models.App, playerCaller: string): DojoCall => {
		return {
			contractName: "snake_actions",
			entrypoint: "on_pre_update",
			calldata: [pixelUpdate, appCaller, playerCaller],
		};
	};

	const snake_actions_onPreUpdate = async (snAccount: Account | AccountInterface, pixelUpdate: models.PixelUpdate, appCaller: models.App, playerCaller: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_snake_actions_onPreUpdate_calldata(pixelUpdate, appCaller, playerCaller),
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		actions: {
			addArea: actions_addArea,
			buildAddAreaCalldata: build_actions_addArea_calldata,
			alertPlayer: actions_alertPlayer,
			buildAlertPlayerCalldata: build_actions_alertPlayer_calldata,
			canUpdatePixel: actions_canUpdatePixel,
			buildCanUpdatePixelCalldata: build_actions_canUpdatePixel_calldata,
			findAreaByPosition: actions_findAreaByPosition,
			buildFindAreaByPositionCalldata: build_actions_findAreaByPosition_calldata,
			findAreasInsideBounds: actions_findAreasInsideBounds,
			buildFindAreasInsideBoundsCalldata: build_actions_findAreasInsideBounds_calldata,
			init: actions_init,
			buildInitCalldata: build_actions_init_calldata,
			newApp: actions_newApp,
			buildNewAppCalldata: build_actions_newApp_calldata,
			processQueue: actions_processQueue,
			buildProcessQueueCalldata: build_actions_processQueue_calldata,
			removeArea: actions_removeArea,
			buildRemoveAreaCalldata: build_actions_removeArea_calldata,
			scheduleQueue: actions_scheduleQueue,
			buildScheduleQueueCalldata: build_actions_scheduleQueue_calldata,
			updatePixel: actions_updatePixel,
			buildUpdatePixelCalldata: build_actions_updatePixel_calldata,
		},
		paint_actions: {
			fade: paint_actions_fade,
			buildFadeCalldata: build_paint_actions_fade_calldata,
			init: paint_actions_init,
			buildInitCalldata: build_paint_actions_init_calldata,
			interact: paint_actions_interact,
			buildInteractCalldata: build_paint_actions_interact_calldata,
			onPostUpdate: paint_actions_onPostUpdate,
			buildOnPostUpdateCalldata: build_paint_actions_onPostUpdate_calldata,
			onPreUpdate: paint_actions_onPreUpdate,
			buildOnPreUpdateCalldata: build_paint_actions_onPreUpdate_calldata,
			pixelRow: paint_actions_pixelRow,
			buildPixelRowCalldata: build_paint_actions_pixelRow_calldata,
			putColor: paint_actions_putColor,
			buildPutColorCalldata: build_paint_actions_putColor_calldata,
		},
		snake_actions: {
			init: snake_actions_init,
			buildInitCalldata: build_snake_actions_init_calldata,
			interact: snake_actions_interact,
			buildInteractCalldata: build_snake_actions_interact_calldata,
			move: snake_actions_move,
			buildMoveCalldata: build_snake_actions_move_calldata,
			onPostUpdate: snake_actions_onPostUpdate,
			buildOnPostUpdateCalldata: build_snake_actions_onPostUpdate_calldata,
			onPreUpdate: snake_actions_onPreUpdate,
			buildOnPreUpdateCalldata: build_snake_actions_onPreUpdate_calldata,
		},
	};
}