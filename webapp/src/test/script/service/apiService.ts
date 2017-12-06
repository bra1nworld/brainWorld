import * as API from "../R.api"
const Echo = API.GenerateEchoAPIService()
export class APIService extends Leaf.Service {
    readonly name = "APIService"
    states = []
    Echo = new Echo
}
