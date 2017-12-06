export interface Hashes {
    [index: string]: string
}
export class BrowserHashService extends Leaf.Service {
    readonly name = "BrowserHashService"
    public states = null
    private hashes: Hashes = {}
    constructor() {
        super()
    }
    public set(k: string, v: string) {
        this.hashes[k] = v
        this.sync()
    }
    public unset(k: string) {
        delete this.hashes[k]
        this.sync()
    }
    private sync() {
        let kvs = []
        for (let name in this.hashes) {
            kvs.push(`${name}=${this.hashes[name]}`)
        }
        window.location.hash = kvs.join("&")
    }
    public syncFromHash(hash: string) {
        if (!hash) {
            window.location.hash = ""
            return
        }
        let hashStr: string
        if (hash.indexOf("#") == 0) {
            hashStr = hash.substr(1)
        } else {
            hashStr = hash
        }
        window.location.hash = hashStr
        let kvs = hashStr.split("&")
        kvs.forEach((kv) => {
            let kvArr = kv.split("=")
            this.hashes[kvArr[0]] = kvArr[1]
        })
        console.log(this.hashes)
    }
    public has(key: string) {
        return this.hashes.hasOwnProperty(key)
    }
    public get(key: string): string {
        if (!this.has(key)) {
            return
        }
        return this.hashes[key]
    }
}
export const browserHashService = new BrowserHashService()
