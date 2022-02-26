import { parseEnvValue } from "./utils/functions/parseEnvValue";
import { PresenceData } from "./typings";
import {
    ActivityType,
    ClientOptions,
    ClientPresenceStatus,
    Intents,
    Options,
    ShardingManagerMode,
    Sweepers
} from "discord.js";
import { join } from "path";
import i18n from "i18n";

export const clientOptions: ClientOptions = {
    allowedMentions: { parse: ["users"], repliedUser: true },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_BANS
    ],
    makeCache: Options.cacheWithLimits({
        MessageManager: {
            maxSize: Infinity,
            sweepInterval: 300,
            sweepFilter: Sweepers.filterByLifetime({
                lifetime: 10800
            })
        },
        ThreadManager: {
            maxSize: Infinity,
            sweepInterval: 300,
            sweepFilter: Sweepers.filterByLifetime({
                lifetime: 10800,
                getComparisonTimestamp: e => e.archiveTimestamp!,
                excludeFromSweep: e => !e.archived
            })
        }
    }),
    retryLimit: 3
};
export const shardsCount: number | "auto" = "auto";
export const shardingMode: ShardingManagerMode = "worker";
export const isDev = process.env.NODE_ENV?.toLowerCase() === "development";
export const isProd = !isDev;
export const mainPrefix = isDev ? "d!" : process.env.MAIN_PREFIX! || "!";
export const altPrefixes: string[] = parseEnvValue(process.env.ALT_PREFIX! || "{mention}").filter((x, i, a) => a.indexOf(x) === i && x !== mainPrefix);
export const embedColor = (process.env.EMBED_COLOR?.toUpperCase() ?? "") || "3CAAFF";
export const lang = (process.env.LOCALE?.toLowerCase() ?? "") || "en";
export const owners: string[] = parseEnvValue(process.env.OWNERS ?? "");
export const devGuild = parseEnvValue(process.env.DEV_GUILD ?? "");
export const streamStrategy = process.env.STREAM_STRATEGY! || "youtube-dl";
export const enableSlashCommand = process.env.ENABLE_SLASH_COMMAND?.toLowerCase() !== "no";
export const musicSelectionType = (process.env.MUSIC_SELECTION_TYPE?.toLowerCase() ?? "") || "message";
export const is247Allowed = process.env.ENABLE_24_7_COMMAND?.toLowerCase() === "yes";
export const stayInVCAfterFinished = process.env.STAY_IN_VC_AFTER_FINISHED?.toLowerCase() === "yes";
export const djRoleName = process.env.DJ_ROLE_NAME! || "DJ";
export const muteRoleName = process.env.MUTE_ROLE_NAME! || "Muted";
export const yesEmoji = process.env.YES_EMOJI! || "✅";
export const noEmoji = process.env.NO_EMOJI! || "❌";

export const presenceData: PresenceData = {
    activities: parseEnvValue(process.env.ACTIVITIES ?? "").map((x, i) => ({
        name: x,
        type: (parseEnvValue(process.env.ACTIVITY_TYPES ?? "")[i]?.toUpperCase() || "PLAYING") as Exclude<ActivityType, "CUSTOM">
    })),
    status: ["online"] as ClientPresenceStatus[],
    interval: 60000
};

i18n.configure({
    defaultLocale: "en",
    directory: join(process.cwd(), "lang"),
    locales: [
        "en",
        "es",
        "id"
    ],
    objectNotation: true
});

i18n.setLocale(lang);

export default i18n;
