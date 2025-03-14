import { DojoEngine } from "@pixelaw/core-dojo"
import { PixelawAgent } from "./PixelawAgent"
import worldsRegistryData from "./config/worlds.json"
import type { WorldsRegistry } from "@pixelaw/core"

const worldsRegistry: WorldsRegistry = worldsRegistryData as WorldsRegistry

import { createDatabase } from "db0"
import sqlite from "db0/connectors/better-sqlite3"
import { createStorage } from "unstorage"
import dbDriver from "unstorage/drivers/db0"
// Learn more: https://db0.unjs.io
const database = createDatabase(
    sqlite({
        path: "db.sqlite",
        /* db0 connector options */
    }),
)

const storage = createStorage({
    driver: dbDriver({
        database,
        tableName: "bot",
    }),
})

const agent = await PixelawAgent.new({ dojoengine: DojoEngine }, worldsRegistry, storage)
