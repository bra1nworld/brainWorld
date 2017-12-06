import { Errors } from "../errors"
import * as mongodb from "mongodb"
import * as Validators from "../validators"
import * as Leaf from "leaf-ts"
import OptionMatch = Validators.Decorator.OptionMatch
export class DbPaginateQuery<T> {
    constructor(public collection: mongodb.Collection) {
    }
    @OptionMatch(new Leaf.Validator()
        .field("index").error(new Errors.InvalidParameter("Invalid query index")).int()
    )
    query(option: PaginateQuery & {
        query?: any,
        sortBy?: {
            [K in keyof T]?: number
        }
    }, callback: Callback<Paginate<T>>) {
        option.pageIndex = option.pageIndex || 0
        let pageSize = option.pageSize || 20
        this.collection.count(option.query || {}, (err, count) => {
            if (err) {
                callback(new Errors.UnknownError("Fail to count", { via: err }))
                return
            }
            let cursor = this.collection.find(option.query)
            option.sortBy = option.sortBy || {
                _id: -1
            } as any
            if (option.sortBy) {
                cursor.sort(option.sortBy as any)
            }
            cursor.skip(option.pageIndex * pageSize).limit(pageSize).toArray((err, result: T[]) => {
                if (err) {
                    callback(new Errors.UnknownError("Fail to get items"))
                    return
                }
                callback(null, {
                    pageIndex: option.pageIndex,
                    pageTotal: Math.ceil(count / pageSize),
                    items: result,
                    total: count
                })
            })
        })
    }
}
