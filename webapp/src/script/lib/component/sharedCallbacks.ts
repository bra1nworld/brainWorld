export interface SharedCallbackFunction {
    (...args: any[]): void
    push?: { (fn: Function): void }
    clear?: { (): void }
    callbacks?: Function[]
    count?: number
}
export const SharedCallbacks = {
    create(): SharedCallbackFunction {
        let fn: SharedCallbackFunction = function (...args: any[]): void {
            let cbs: Function[] = fn.callbacks.slice(0)
            fn.clear()
            cbs.forEach(function (callback) {
                callback(...args)
            })
        }
        fn.callbacks = []
        fn.push = function (callback: Function) {
            fn.callbacks.push(callback)
            fn.count = fn.callbacks.length
        }
        fn.clear = function () {
            fn.callbacks.length = 0
            fn.count = 0
        }
        return fn
    },
}
export default SharedCallbacks

