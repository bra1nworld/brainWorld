export declare class FormBehavior<T = {
    [key: string]: any;
}> {
    private widget;
    constructor(widget: Leaf.Widget);
    definition: FormDataDefinition<T>;
    getData(): T;
    validate(): void;
}
export declare class FormDataDefinition<T> extends Leaf.DataDefinition<T> {
    private widget;
    private formBehavior;
    constructor(widget: Leaf.Widget, formBehavior: FormBehavior);
    input(name: string): this;
    getData(): any;
    validate(): void;
    private getInputName(field);
}
