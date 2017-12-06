// RuntimeMeta is compiled at release time, by /util/build script.

let RuntimeMeta: {
    version?: string,
    cdnBase?: string
} = window["RuntimeMeta"] || {}
export const version = RuntimeMeta.version || "VERSION:Realtime"
export const cdnBase = RuntimeMeta.cdnBase || ""
