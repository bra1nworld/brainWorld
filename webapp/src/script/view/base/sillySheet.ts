import * as Dict from "../../dict"
import { SillyTable } from "./sillyTable"

type DataItem = {
    title: string
    data: string
}
export class SillySheet<TModel> extends R.Base.SillySheet {
    dataGrid: DataItem[][]
    constructor(private option: {
        fields: {
            [K in keyof TModel]?: string
        },
        types?: {
            [K in keyof TModel]?: string
        }
        optional?: {
            [K in keyof TModel]?: boolean
        } | boolean
        metas?: {
            [K in keyof TModel]?: any
        }
        data?: TModel
        rows?: number
    }) {
        super()
        let data = option.data || {}
        let fields = option.fields || {}
        let types = option.types || {}
        let metas = option.metas || {}
        let rows = option.rows || 2
        let count = 1
        let list: DataItem[]

        for (let name in option.fields) {
            list.push({
                title: name,
                data: option.fields[name]
            })
        }
        console.log(list)
    }
}
