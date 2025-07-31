import { queryTorii } from "@dojoengine/sdk/sql";
import type { App, AppStore } from "@pixelaw/core";
import type { DojoStuff } from "./DojoEngine.init.ts";
import { convertFullHexString } from "./utils/utils.ts";

type State = { [key: string]: App | undefined };

interface AppRowData {
	action: string;
	icon: string;
	name: string;
	plugin: string;
	system: string;
	entity: {
		id: string;
	};
}

export class DojoAppStore implements AppStore {
	private dojoStuff;
	private state: State = {};

	constructor(dojoStuff: DojoStuff) {
		this.dojoStuff = dojoStuff;
	}

	public static async getInstance(dojoStuff: DojoStuff): Promise<DojoAppStore> {
		const dojoAppStore = new DojoAppStore(dojoStuff);

		await dojoAppStore.initialize();
		// await dojoAppStore.subscribe()
		return dojoAppStore;
	}

	private async initialize() {
		try {
			const items = await queryTorii(
				this.dojoStuff.toriiUrl,
				`SELECT * 
                FROM "pixelaw-App";`,
				(rows: AppRowData[]) => {
					return rows;
				},
			);
			for (const item of items) {
				const app: App = {
					action: convertFullHexString(item.action),
					icon: convertFullHexString(item.icon),
					name: convertFullHexString(item.name),
					plugin: item.plugin,
					system: item.system,
					entity: { id: "" }, // TODO
				};
				this.state[app.name] = app;
				console.log("APP", app);
			}
			// console.log({ items })
		} catch (e) {
			console.error(e);
		}
	}

	getAll(): App[] {
		return Object.values(this.state);
	}

	getByName(name: string): App | undefined {
		return this.state[name];
	}

	getBySystem(system: string): App | undefined {
		return Object.values(this.state).find((app) => app?.system === system);
	}
}
