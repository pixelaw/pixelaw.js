import { KeysClause, type SDK } from "@dojoengine/sdk";
import { queryTorii } from "@dojoengine/sdk/sql";
import {
	areBoundsEqual,
	type Bounds,
	type Coordinate,
	type Notification,
	type NotificationStore,
	type NotificationStoreEvents,
	type PixelawCore,
	type Position,
} from "@pixelaw/core";
import mitt from "mitt";
import type { DojoEngine } from "./DojoEngine.ts";
import type { SchemaType } from "./generated/models.gen.ts";
import { getQueryBounds } from "./utils/querybuilder.ts";
import { convertFullHexString } from "./utils/utils.ts";

type State = { [key: string]: Notification | undefined };

const QUERY_RADIUS = 20;

export class DojoNotificationStore implements NotificationStore {
	public readonly eventEmitter = mitt<NotificationStoreEvents>();
	private sdk: SDK<SchemaType>;
	private static instance: DojoNotificationStore;
	private isSubscribed = false;
	private state: State = {};
	private toriiUrl;
	private queryBounds: Bounds | null = null;
	private core: PixelawCore;

	protected constructor(core: PixelawCore) {
		const engine = core._engine as DojoEngine;
		this.sdk = engine.dojoSetup.sdk;
		this.toriiUrl = engine.dojoSetup.toriiUrl;
		this.core = core;
	}

	// Singleton factory
	public static async getInstance(
		core: PixelawCore,
	): Promise<DojoNotificationStore> {
		if (!DojoNotificationStore.instance) {
			DojoNotificationStore.instance = new DojoNotificationStore(core);

			await DojoNotificationStore.instance.subscribe();
			await DojoNotificationStore.instance.initialize();
		}
		return DojoNotificationStore.instance;
	}

	private async initialize() {
		try {
			// TODO Notifications should be filtered by wallet address
			// const wallet = this.core.wallet as DojoWallet

			const items = await queryTorii(
				this.toriiUrl,
				createSqlQueryByRadius(
					this.core.center,
					QUERY_RADIUS,
					this.core.lastEventAck /*,  wallet.getAccount()*/,
				),
				(rows: any[]) => {
					return rows.map((item) => {
						return {
							from: item.from,
							to: item.to,
							color: item.color,
							app: item.app,
							position: {
								x: item["position.x"],
								y: item["position.y"],
							},
							text: convertFullHexString(item.text),
							timestamp: Date.now(),
						};
					});
				},
			);
			for (const item of items) {
				const key = `${item.position.x},${item.position.y}-${item.timestamp}`;
				this.setNotification(key, item);
				this.eventEmitter.emit("added", item);
			}
		} catch (e) {
			console.error(e);
		}
	}

	private async subscribe() {
		if (this.isSubscribed) return;
		try {
			const subscription = this.sdk.client.onEventMessageUpdated(
				KeysClause(
					["pixelaw-Notification"],
					[undefined],
					"VariableLen",
				).build(),
				(data) => {
					try {
						console.log("notification from sub", data);
						const p = data.models["pixelaw-Notification"];

						if (Object.keys(data).length === 0) {
							// Notification got deleted
							return;
						}

						const notification = {
							from:
								p.from.value.option === "None"
									? null
									: p.from.value.value.value,
							to: p.to.value.option === "None" ? null : p.to.value.value.value,
							color: p.color.value,
							app: p.app.value,
							position: {
								x: p.position.value.x.value,
								y: p.position.value.y.value,
							},
							text: convertFullHexString(p.text.value),
							timestamp: Date.now(),
						};

						const key = `${notification.position.x},${notification.position.y}-${notification.timestamp}`;
						this.setNotification(key, notification);
						this.eventEmitter.emit("added", notification);
						this.core.events.emit("notification", notification);
					} catch (e) {
						console.error(e);
					}

					this.cacheUpdated = Date.now();
				},
			);

			this.isSubscribed = true;
			return () => {
				console.log("cancel");
				subscription.cancel();
				this.isSubscribed = false;
			};
		} catch (error) {
			console.error("Subscription error:", error);
		}
	}

	public setNotification(key: string, Notification: Notification): void {
		this.state[key] = Notification;
	}

	public getAll(): Notification[] {
		const lastEventAck = this.core.lastEventAck;
		return Object.values(this.state)
			.filter((n): n is Notification => n !== undefined)
			.filter((n) => n.timestamp > lastEventAck);
	}

	public setBounds(newBounds: Bounds): void {
		const newQueryBounds = getQueryBounds(newBounds);

		if (
			!this.queryBounds ||
			!areBoundsEqual(this.queryBounds, newQueryBounds)
		) {
			this.queryBounds = newQueryBounds;
		}
	}

	getLastForPosition(_position: Position): Notification[] {
		return [];
	}
}
export function createSqlQueryByRadius(
	center: Coordinate,
	radius: number,
	_lastEventAck: number,
	address: string,
) {
	console.log("add", address);
	let result = `SELECT
                      "from", "to", "text", "position.x" , "position.y", "color"
                  FROM "pixelaw-Notification"
                  WHERE (("position.x" - ${center[0]}) * ("position.x" - ${center[0]}) + ("position.y" -  ${center[1]}) * ("position.y" -  ${center[1]})) <= (${radius} * ${radius})
    `;

	result += ";";
	return result;
}
/*

export function createSqlQuery(bounds: Bounds) {
    const [[left, top], [right, bottom]] = bounds

    let result = `SELECT
                      json_array(A.caller, A.player, ltrim(substr(A.message, 4), '0'), (A.x << 16) | A.y, A.timestamp) as d
                  FROM "pixelaw-Notification" as A
                  WHERE (A.x >= ${left} AND A.y >= ${top} AND A.x <= ${right} AND A.y <= ${bottom} )
                  `

    result += ";"
    return result
}
*/
