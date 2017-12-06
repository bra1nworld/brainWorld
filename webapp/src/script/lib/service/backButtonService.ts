import { History } from "../component/history"
export class BackButtonService extends Leaf.Service {
    public name = "BackButtonService"
    public states = null
    public readonly history = new History()
    register(id: any, callback: Function) {
        this.history.registerBackButton(id, callback)
    }
    remove(id: any) {
        return this.history.removeBackButton(id)
    }
}
