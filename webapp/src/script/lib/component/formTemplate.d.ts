export interface FieldConstructor<T = any> {
    new (option: {
        name: string;
        displayName: string;
    }): Field<T>;
}
export interface Field<T = any> extends Leaf.Widget {
    name: string;
    displayName: string;
    getValue(): T;
    setValue(T: any): any;
    setMeta?(any: any): any;
    validate?(v: T): any;
}
