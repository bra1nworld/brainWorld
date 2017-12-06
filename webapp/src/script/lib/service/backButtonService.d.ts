import { History } from "../component/history";
export declare class BackButtonService extends Leaf.Service {
    name: string;
    states: any;
    readonly history: History;
    register(id: any, callback: Function): void;
    remove(id: any): void;
}
