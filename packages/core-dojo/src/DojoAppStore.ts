import type { App, AppStore } from "@pixelaw/core"
import type { DojoStuff } from "./DojoEngine.init.ts"

export class DojoAppStore implements AppStore {
    private dojoStuff
    // TODO handle updated apps
    constructor(dojoStuff: DojoStuff) {
        this.dojoStuff = dojoStuff
    }
    getAll(): App[] {
        return this.dojoStuff!.apps
    }

    getByName(name: string): App | undefined {
        return this.dojoStuff!.apps.find((app) => app.name === name)
    }
}
