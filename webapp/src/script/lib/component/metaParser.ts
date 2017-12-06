export abstract class MetaParser {
    static parse<T extends {
        [index: string]: string | string[]
    }>(): T {
        let metas = document.querySelectorAll("meta")
        let result: T = {} as T
        for (let i; i < metas.length; i++) {
            let item = metas[i]
            let name = item.getAttribute("name")
            let content = item.getAttribute("content")
            if (!name) continue
            if (typeof result[name] === "string") {
                result[name] = [result[name] as string, content]
            } else if (result[name] instanceof Array) {
                (result[name] as string[]).push(content)
            } else {
                result[name] = content
            }
        }
        return result
    }
}
