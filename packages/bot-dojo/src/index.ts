import {DojoEngine} from "@pixelaw/core-dojo"
import {PixelawAgent} from "./PixelawAgent"

import worldsRegistry from "./config/worlds.json"

const agent = PixelawAgent.new([DojoEngine], worldsRegistry)
