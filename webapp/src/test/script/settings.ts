import * as meta from "./meta"
let url = window.location.toString()

export const debug = url.indexOf("debug") >= 0

console.log("Running on", meta.version)
