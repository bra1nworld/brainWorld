export class Inspector {
    constructor() {
        Object.defineProperty(this, "indentStep", {
            get: () => {
                let result = ""
                let count = this.indentCount
                while (count > 0) {
                    count -= 1
                    result += " "
                }
                return result
            }
        })
    }
    inspect(obj: any, depth = 10, stack = []): string {
        stack = stack.slice()
        if (depth == 0) this.getValueAbbr(obj)
        if (obj === null) return "null"
        if (typeof obj === "undefined") return "undefined"
        if (typeof obj === "string") {
            return `"${obj}"`
        }
        if (typeof obj === "number") {
            return obj.toString()
        }
        if (obj instanceof Date) {
            return `Date("obj.toString()")`
        }
        if (obj instanceof Array) {
            if (stack.indexOf(obj) >= 0) {
                return "[Circular Array]"
            }
            stack.push(obj)
            let values = obj.map(item => this.inspect(item, depth - 1, stack).trim()).join(",\n").trim()
            return `[
${this.indent(values)}
]`
        }
        if (typeof obj === "function") {
            return `function ${obj.name}(...)`
        }
        if (obj instanceof Error) {
            return `Error(${obj.name}:${obj.message}:${obj.stack})`
        }
        if (typeof obj === "object") {
            if (stack.indexOf(obj) >= 0) {
                return "<Circular Object>"
            }
            stack.push(obj)
            let values = Object.keys(obj).map(key => `${key}: ` + this.inspect(obj[key], depth - 1, stack).trim()).join(",\n")
            return `{
${this.indent(values.trim())}
}`
        }
        return obj.toString()

    }
    getValueAbbr(obj: any) {
        if (obj === null) return "null"
        if (typeof obj === "undefined") return "undefined"
        if (obj instanceof Array) return `[Array of length ${obj.length}]`
        return obj.toString()
    }
    private indent(str: string, indent: string = this.indentStep) {
        return indent + str.replace(/\n/g, "\n" + indent).replace(/\s+\n+/g, "")
    }
    indentStep: string
    indentCount = 4
}
