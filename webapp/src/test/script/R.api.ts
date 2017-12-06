export function GenerateEchoAPIService<T extends (new (...args: any[]) => {}) = new (...args: any[]) => {}>(factory: Leaf.APIFactory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }), Base: T = class { } as any) {
    return class extends Base {
        public factory = factory
        echo = factory.createAPIFunction<{
            name: string
        } & {
                content: string
            }, {
                name: string
                content: string
            }>({
                method: "POST",
                path: "echo/:name/GET"
            })
    }
}
