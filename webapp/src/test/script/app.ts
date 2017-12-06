import { FastClick } from "./lib/fastclick"
import * as Settings from "./settings"
import { APIService } from "./service/apiService"
class Application {
    events = new Leaf.EventEmitter<{
        initializing
        initialized
    }>()
    constructor() {
    }
    services = new Leaf.ServiceContext()
    api = this.services.register(new APIService())
    initialize() {
        this.events.emit("initializing")
        // Solve mobile problem
        FastClick.attach(document.body);
        // All other code goes here

        this.events.emit("initialized")
        this.services.setup(() => {
            // Invoke echo api service
            this.api.Echo.echo({
                name: "name",
                content: "QAQ"
            }, (err, result) => {
                console.log(err, result)
            })
        })
    }
}

export const App = new Application()
