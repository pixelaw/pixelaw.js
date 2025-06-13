import * as fs from "node:fs"
import { describe, expect, it } from "vitest"
import { parseEventsFromSimulation } from "../utils/parseEvents"

const simJson = JSON.parse(fs.readFileSync(`${process.cwd()}/src/__tests__/sim.json`, "utf-8"))

describe("parseEventsFromSimulation", () => {
    it("should correctly parse events with valid data", () => {
        const res = parseEventsFromSimulation(
            "0x7e607b2fbb4cfb3fb9d1258fa2ff3aa94f17b3820e42bf1e6a43e2de3f5772e",
            simJson,
        )
        console.info(res)
        // Test implementation for valid data
        expect(true).toBe(true) // Replace with actual test
    })
})
