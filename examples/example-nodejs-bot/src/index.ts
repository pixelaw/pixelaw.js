import { PixelawCore } from "@pixelaw/core";
import type { CoreStatus, Engine, WorldConfig } from "@pixelaw/core";
import mitt from "mitt";

import { DojoEngine } from "@pixelaw/core-dojo";
import {PixelawAgent} from "./PixelawAgent";

import worldsRegistry from "./config/worlds.json"



const agent = new PixelawAgent(worldsRegistry, [DojoEngine]);
