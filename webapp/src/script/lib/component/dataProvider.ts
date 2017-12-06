export class DataProvider<TVM, TData, TRequestOption> {
    widget: Leaf.Widget<any, TVM>
    fetcher: (option: TRequestOption, callback: Callback<TData>) => void
    constructor(option: {
        widget: Leaf.Widget<any, TVM>
        fetcher: (option: TRequestOption, callback: Callback<TData>) => void
    }) {
        this.widget = option.widget
        this.fetcher = option.fetcher
    }
    events = new Leaf.EventEmitter<{
        update
        error: Error
    }>()
    refresh(option: TRequestOption = {} as any) {
        this.fetcher(option, (err, result) => {
            if (err) {
                this.events.emit("error", err)
                return
            }
            this.fill(result)
        })
        return this
    }
    map(dataMap: {
        [K in keyof TVM]: keyof TData | ((TData) => any)
    }) {
        this.dataMap = dataMap
        return this
    }
    fill(data: TData) {
        for (let prop in data) {
            if (this.widget.ViewModel.hasKey(prop)) {
                this.widget.VM[prop as string] = data[prop]
            }
        }
        for (let key in this.dataMap) {
            let mapper = this.dataMap[key]
            if (typeof mapper == "string") {
                this.widget.VM[key] = data[mapper]
            } else {
                this.widget.VM[key] = mapper(data)
            }
        }
    }
    private dataMap = {}
}
export type Constructor<T> = {
    new(...args: any[]): T
}
export class ListDataProvider<TData, TItem extends Leaf.ListItem, TRequestOption, TVM = TItem["VM"]>{
    list: Leaf.List<TItem>
    fetcher: (option: TRequestOption, callback: Callback<TData[]>) => void
    Item: Constructor<TItem>
    readonly: boolean
    constructor(option: {
        list: Leaf.List<TItem>
        fetcher: (option: TRequestOption, callback: Callback<TData[]>) => void
        readonly: boolean,
        Item: Constructor<TItem>
    }) {
        this.list = option.list
        this.fetcher = option.fetcher
        this.Item = option.Item
        this.readonly = option.readonly
    }
    events = new Leaf.EventEmitter<{
        update
        error: Error
        finished
    }>()
    refresh(option: TRequestOption = {} as any) {
        this.fetcher(option, (err, result) => {
            if (err) {
                this.events.emit("error", err)
                return
            }
            this.fill(result)
        })
    }
    transform(transformer: (data: TData) => any) {
        this.transformer = transformer
    }
    private transformer: (data: TData) => any = (item) => item
    map(dataMap: {
        [K in keyof TVM]: keyof TData | ((TData) => any)
    }) {
        this.dataMap = dataMap
    }
    insert(data: TData, index = -1) {
        let item = new this.Item(this.transformer(data), this.readonly)
        for (let prop in data) {
            if (item.ViewModel.hasKey(prop)) {
                item.VM[prop as string] = data[prop]
            }
        }
        for (let key in this.dataMap) {
            let mapper = this.dataMap[key]
            if (typeof mapper == "string") {
                item.VM[key] = data[mapper]
            } else {
                item.VM[key] = mapper(data)
            }
        }
        if (index === -1) {
            this.list.push(item)
        } else {
            this.list.splice(index, 0, item)
        }
        return item
    }
    fill(datas: TData[]) {
        if (this.list.length) {
            this.list.length = 0
        }
        if (datas && datas.length > 0) {
            for (let data of datas) {
                this.insert(data)
            }
        }
        this.events.emit("finished")
    }
    private dataMap = {}
}
