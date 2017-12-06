export type Constructor<T = {}> = new (...args: any[]) => T;

export class FormTemplate<TTypes extends {
    [name: string]: FieldConstructor
}= {}> {
    option: {
        className: string
        container: string
    } = {
        className: "form",
        container: "container"
    }
    config(option: {
        name: string
    }) {
    }
    fieldConstructors: {
        [name: string]: FieldConstructor
    } = {}
    defaultFieldConstructor: FieldConstructor
    constructor(fields: TTypes) {
        for (let name in fields) {
            this.register(name, fields[name])
        }
    }
    register<K extends keyof TTypes>(name: K, Con: TTypes[K]) {
        // first registered field is the default
        if (!this.defaultFieldConstructor) this.defaultFieldConstructor = Con
        this.fieldConstructors[name] = Con
    }
    create<TModel, TBase extends Constructor<Leaf.Widget>>(option: {
        fields: {
            [K in keyof TModel]?: string
        },
        types?: {
            [K in keyof TModel]?: string
        }
        optional?: {
            [K in keyof TModel]?: boolean | { (currentValue: TModel): boolean }
        } | boolean
        metas?: {
            [K in keyof TModel]?: any
        }
        depends?: {
            [K in keyof TModel]?: (currentValue: TModel) => boolean
        }
        validates?: {
            [K in keyof TModel]?: (value: TModel[K], all: TModel) => void
        }
        computes?: {
            [K in keyof TModel]?: (value: TModel) => TModel[K]
        }
        // get some custom values somewhere
        process?: (value: TModel, formWidget: Leaf.Widget) => TModel
        data?: TModel
        readonly?: {
            [K in keyof TModel]?: boolean
        } | boolean
    }, Base: TBase) {
        let form = this
        return class extends Base {
            //static extends(newOption: typeof option) {
            //    let op = Leaf.Util.clone(option)
            //    for (let prop in newOption) {
            //        if (typeof op[prop] !== "object" || !op[prop]) {
            //            op[prop] = newOption
            //        }
            //        op[prop] = {
            //            ...op[prop],
            //            ...newOption[prop]
            //        }
            //    }
            //    return form.create(op, Base)
            //}
            constructor(...args: any[]) {
                let el = document.createElement("div")
                el.className = "form"
                el.setAttribute("data-id", "container")
                super(el)
                this.fields = {}
                this.buildForm()
            }
            private buildForm() {
                // almost same as silly form but there are three condition
                // 1. has existing widget somewhere
                // 2. has a placeholder somewhere
                // 3. has a nothing just append
                // So for each field we will
                // for field in this.option.fields search for node with data-id accordingly
                //     1. find a DOM with identical data-id
                //         1.1 check for corresponding widget and match the field interface => use it
                //         1.2 or check if it is a InputElement => wrap it and use it
                //         1.3 considered as a placeholder => generate the field and replace it, also update this.UI,this.fields
                //     2. gerneate the field and append to the "container"
                // save all generated field to this.fields

                // For now we only generate everything
                let metas = option.metas || {}
                for (let field in option.fields) {
                    let type = option.types[field] || null
                    let Cons = form.fieldConstructors[type] || form.defaultFieldConstructor
                    const fieldItem = this.fields[field] = new Cons({
                        name: field,
                        displayName: option.fields[field]
                    })
                    let meta = metas[field]
                    this.UI[form.option.container].appendChild(fieldItem.node)
                    if (meta && fieldItem.setMeta) {
                        fieldItem.setMeta(meta)
                    }
                }
            }
            public setValue(v: TModel) {
                for (let name in v) {
                    const field = this.fields[name]
                    if (!field) continue
                    field.setValue(v[name])
                }
                option.data = v
            }
            public getValue(trial?: boolean): TModel {
                let result = { ...(option.data || {}) } as any
                for (let name in this.fields) {
                    let field = this.fields[name]
                    result[name] = field.getValue()
                }
                return result as TModel
            }
            public fields: {
                [K in keyof TModel]?: Field<TModel[K]>
            }
        }
    }
}

export interface FieldConstructor<T = any> {
    new(option: {
        name: string
        displayName: string
    }): Field<T>
}
export interface Field<T = any> extends Leaf.Widget {
    name: string
    displayName: string
    // get value dont' validate
    getValue(): T
    setValue(T)
    setMeta?(any)
    validate?(v: T)
}
