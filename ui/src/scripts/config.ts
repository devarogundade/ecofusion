import { networkConfig } from "./networks";
import type { AppConfig } from "@/types";
import * as constants from "./constants";

export const appConfig: AppConfig & {
    constants: typeof constants;
} = {
    networks: networkConfig,
    constants
};