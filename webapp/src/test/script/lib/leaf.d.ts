interface DynamicValueConfig {
    type: "raw" | "value";
    content: string;
    value?: string;
    reverse?: boolean;
}
interface DynamicStringConfig {
    templates: DynamicValueConfig[];
}
interface DynamicPropertyConfig extends DynamicStringConfig {
    name: string;
}
declare type DOMEventInfo = {
    name: string;
    bubble: boolean;
    target?: string[];
};
declare type ElementConfigProperties = {
    [index: string]: DynamicPropertyConfig | string;
};
declare type DynamicProperties = {
    [index: string]: DynamicPropertyConfig;
};
declare type WidgetEventHandler = {
    (e: Event): void;
};
declare type WidgetTemplate = string | HTMLElement | {
    (): string | HTMLElement;
};
interface WidgetEnhancedEvent extends Event {
    capture?: {
        (): void;
    };
    bubblingTarget: HTMLElement;
}
declare type Slot = {
    name: string;
    el: Element | Text;
};
declare type Callback<T = null, E extends Error = Error> = (error?: E, option?: T) => void;
declare namespace Leaf {
    interface PropertyDefination<T> {
        get?: (cache: PropertyCache<T>) => T;
        set?: (value: T, cache: PropertyCache<T>) => void;
        value?: T;
    }
    interface PropertyCache<T> {
        [index: string]: any;
        value?: T;
    }
    class Property {
        static define<T>(who: any, name: string, def: PropertyDefination<T>): T;
        static withProps(who: any): WithProperty<{}>;
    }
    class WithProperty<T> {
        who: any;
        constructor(who: any);
        define<T>(name: string, def: PropertyDefination<T>): this;
    }
}
declare namespace Leaf {
    class Util {
        constructor();
        static clone<T>(obj: T): T;
        static capitalize(str: string): string;
        static uncapitalize(str: string): string;
        static camelToSlug(str: string): string;
        static slugToCamel(str: string): string;
        static deepEqual(a: any, b: any): boolean;
        static dictDiff<T>(d1: {
            [index: string]: T;
        }, d2: {
            [index: string]: T;
        }, identical?: (a: T, b: T) => boolean): {
            left: string[];
            right: string[];
            interact: string[];
        };
        static arrayDiff<T>(arr1?: T[], arr2?: T[], identical?: (a: T, b: T) => boolean): {
            left: T[];
            right: T[];
            interact: T[];
        };
        static buildOption<T>(defaultOption: T, option?: Partial<T>): T;
        static getBrowserInfo(): BrowserInfo;
        static isMobile(): boolean;
        static browser: BrowserInfo;
    }
    interface BrowserInfo {
        name: string;
        version: string;
        mobile: boolean;
    }
    interface SharedCallbackFunction {
        (...args: any[]): void;
        push?: {
            (fn: Function): void;
        };
        clear?: {
            (): void;
        };
        callbacks?: Function[];
        count?: number;
    }
    const SharedCallbacks: {
        create(): SharedCallbackFunction;
    };
}
declare namespace Leaf {
    type StringFunction = (name: string) => string;
    function renderString(str: string, actions: {
        [index: string]: string | StringFunction;
    }): string;
    function render<T>(obj: T, actions: {
        [index: string]: string | StringFunction;
    }): T;
}
declare namespace Leaf {
    type EventEmitterHandler<T> = (T, ...args: any[]) => void;
    interface EventHandlerInfo {
        owner?: any;
        once?: boolean;
        handler: Function;
    }
    interface EventHandlers {
        [index: string]: EventHandlerInfo[];
    }
    class EventEmitter<E = {
        [key: string]: any;
    }> {
        private events;
        readonly DECLARE: E;
        constructor();
        addEventListener<K extends keyof E>(event: K, handler: EventEmitterHandler<E[K]>): this;
        on<K extends keyof E>(event: keyof E, handler: EventEmitterHandler<E[K]>): this;
        once<K extends keyof E>(event: keyof E, handler: EventEmitterHandler<E[K]>): this;
        listenByOnce<K extends keyof E>(who: any, event: K, handler: EventEmitterHandler<E[K]>): this;
        listenBy<K extends keyof E>(who: any, event: K | K[], handler: EventEmitterHandler<E[K]>): this;
        stopListenBy<K extends keyof E>(who: any, event?: keyof E, handler?: EventEmitterHandler<E[K]>): this;
        removeEventListener<K extends keyof E>(event?: keyof E, handler?: EventEmitterHandler<E[K]>): this;
        emit<K extends keyof E>(event: K, ...values: E[K][]): this;
        private getOrCreateEventHandlers(event);
    }
}
declare namespace Leaf {
    type TStateDefaultEnum = "void" | "panic";
    class States<TStateEnum extends string = string, TSignalEnum = {
        [key: string]: any;
    }> {
        events: EventEmitter<{
            [key: string]: any;
            reset?: void;
            state?: TStateEnum | "void" | "panic";
        }>;
        state: TStateEnum | TStateDefaultEnum;
        previousState: TStateEnum | TStateDefaultEnum;
        private sole;
        private soleEmitted;
        private lastException;
        private rescues;
        protected data: any;
        private feeds;
        private isDebugging;
        private clearHandler;
        readonly name: string;
        panicError: Error;
        panicState: TStateEnum | TStateDefaultEnum;
        constructor();
        reset(): void;
        setState(state: TStateEnum | TStateDefaultEnum, ...args: any[]): void;
        private _stateFinish();
        protected clearConsumers(): void;
        private _setState(state, ...args);
        error(err: Error): void;
        protected atPanic(): void;
        recover(recoverState?: TStateEnum | TStateDefaultEnum): {
            error: Error;
            state: TStateEnum | "void" | "panic";
        };
        respawn(): void;
        clear(handler?: {
            (): void;
        }): void;
        private ensureFeed<K>(name);
        feed(name: keyof TSignalEnum, signal?: any): void;
        consumeAll(name: string): number;
        hasFeed(name: string): boolean;
        consume(name: string): boolean | any;
        consumeWhenAvailableMergeToLast<K extends keyof TSignalEnum>(name: K, callback: {
            (signal: TSignalEnum[K]): void;
        }): void;
        isConsuming(name: keyof TSignalEnum): boolean;
        consumeWhenAvailable(name: keyof TSignalEnum, callback: {
            (signal: any): void;
        }): void;
        debug(option?: any): void;
        private debugStateHandler(option?, message?);
        private _assertingStateSequence;
        private _assertingStateCallback;
        private _assertingStateIndex;
        assertStateSequence(states: TStateEnum[], callback: (err: Error) => void): void;
        private _endStateAssertion(err?);
        private _updateStateAssertion(state);
    }
}
declare namespace Leaf {
    class ErrorDoc<TErrors> {
        private errorNames;
        private errors;
        static create<TErrors>(): ErrorDoc<TErrors>;
        static build<TErrors>(info: TErrors): {
            [K in keyof TErrors]: CustomErrorConstructor<TErrors[K]>;
        };
        define(name: string, base?: string | Error | Function, defaultProperty?: any): this;
        generate(): TErrors;
    }
    function createError(name: string, base?: Error | Function, defaultProperty?: any): (message: string, detail: any) => void;
    type Partial<T> = {
        [P in keyof T]?: T[P];
    };
    interface CustomErrorConstructor<TDetail> {
        new (message?: string, detail?: Partial<TDetail> & {
            via?: Error;
        }): {
            detail: TDetail;
        } & Error & {
            via: Error;
        };
    }
    const Errors: ErrorsOf<{
        Timeout: {};
        Abort: {};
        IOError: {};
        NetworkError: {};
    }>;
    type ErrorsOf<T> = {
        [P in keyof T]?: CustomErrorConstructor<T[P]>;
    };
}
declare namespace Leaf {
    interface APICallback<TResult> {
        (error?: Error, result?: TResult): void;
    }
    interface APIFunction<TOption, TResult> {
        (option: TOption, callback: APICallback<TResult>): void;
        API?: APIDeclare<TOption, TResult>;
        mock: (option: TOption, error?: Error, result?: TResult) => APIFunction<TOption, TResult>;
    }
    interface APIOption {
        method: string | "GET" | "POST" | "PUT" | "DELETE";
        path: string;
        timeout?: number;
        headers?: any;
        data?: any;
        withCredentials?: boolean;
        bodyType?: "json" | "query";
        mock?: boolean;
    }
    class APIFactory {
        option: {
            root?: string;
            prefix?: string;
            suffix?: string;
            defaultTimeout?: number;
            withCredentials?: boolean;
            headers?: any;
            bodyType?: "json" | "query";
            mock?: boolean;
            errorMapper?: (err: Error) => Error;
        };
        responseHandler: {
            (response: string, callback: (error: Error, data: any) => void): void;
        };
        private _handleResponse<TResult>(response, callback);
        constructor(option: {
            root?: string;
            prefix?: string;
            suffix?: string;
            defaultTimeout?: number;
            withCredentials?: boolean;
            headers?: any;
            bodyType?: "json" | "query";
            mock?: boolean;
            errorMapper?: (err: Error) => Error;
        });
        createAPI<TOption, TResult>(option: APIOption): APIDeclare<TOption, TResult>;
        createAPIFunction<TOption, TResult>(option: APIOption): APIFunction<TOption, TResult>;
        errorMapper: (err: Error) => Error;
        private solveResponse(err, response, callback);
        request<TResult>(option: {
            method?: string;
            url: string;
            query?: any;
            withCredentials?: boolean;
            headers?: any;
            timeout?: number;
            bodyType?: "json" | "query";
        }, callback: {
            (err, result: TResult): void;
        }): XMLHttpRequest;
        buildQueryString(query: any): string;
    }
    class APIDeclare<TOption, TResult> {
        private factory;
        private option;
        private mocks;
        constructor(factory: APIFactory, option: APIOption);
        mock(option: TOption, error?: Error, result?: TResult): this;
        private _mock(option, callback);
        getFunction(): APIFunction<TOption, TResult>;
        invoke(data: TOption, callback: APICallback<TResult>): void;
    }
}
declare namespace Leaf {
    class History {
        handlePopState(): void;
        constructor();
        private stack;
        push(id: string, callback: Function): void;
        remove(id: string): void;
        activate(): void;
        deactivate(): void;
    }
}
declare namespace Leaf {
    class DataSource<TAttribute> {
        readonly _name: string;
        protected _fields: (keyof TAttribute)[];
        events: EventEmitter<{
            [key: string]: any;
            change: Partial<TAttribute>;
        }>;
        readonly fields: (keyof TAttribute)[];
        id: string;
        protected _data: TAttribute;
        readonly data: TAttribute;
        [index: string]: any;
        constructor(_name: string, _fields?: (keyof TAttribute)[]);
        private define(name, defaultValue?);
        hasKey(key: string): boolean;
        sets(obj: any): boolean;
        set(key: keyof TAttribute, value: any, silent?: boolean): boolean;
        get(key: keyof TAttribute): any;
        toJSON(): any;
    }
    class Model<T> extends DataSource<T> {
    }
}
declare namespace Leaf {
    class Namespace {
        private Widgets;
        include(W: any, name?: string): void;
        getWidgetByName(name: string): WidgetConstructor;
        createWidgetByName(name: string, props?: any): WidgetAny;
        isTagWidgetName(name: string, who: WidgetAny): boolean;
        clear(): void;
        has(name: string): boolean;
    }
}
declare namespace Leaf {
    class ViewModel<TVMs> extends Model<TVMs> {
        readonly _name: string;
        protected _fields: (keyof TVMs)[];
        private depChain;
        constructor(_name: string, _fields?: (keyof TVMs)[]);
        set(key: keyof TVMs, value: any, silent?: boolean): boolean;
    }
    class DependencyChain {
        events: EventEmitter<{
            declare: {
                src: string;
                target: string;
            };
            revoke: {
                src: string;
                target: string;
            };
        }>;
        extractFunctionDependency(fn: Function): string[];
        maxDepth: number;
        updateFunctionDependency(name: string, fn: Function): void;
        validateDependency(target: string, src: string[], depth?: number): boolean;
        dependencyMap: {
            [index: string]: string[];
        };
    }
}
declare namespace Leaf {
    interface WidgetElement extends HTMLElement {
        widget: WidgetAny;
        propertyConfigs: WidgetDynamicPropertyConfig[];
    }
    interface WidgetDynamicPropertyConfig {
        master: WidgetAny;
        rules: DynamicProperties;
    }
    abstract class WidgetCoreDesign {
        protected widget: WidgetAny;
        constructor(widget: WidgetAny);
        subWidgetPlaceholder: {
            [index: string]: {
                holder: HTMLElement;
                dynamics: DynamicProperties;
                slots: Slot[];
            };
        };
        slotsPlaceholder: {
            [index: string]: {
                el: HTMLElement;
                name: string;
                dynamics: DynamicProperties;
                index: number;
            };
        };
        slotIndexOffset: number;
        abstract attachElement(el: WidgetElement, dynamics: DynamicProperties): any;
        abstract detachElement(el: WidgetElement): any;
        abstract attachText(text: Text, config: DynamicStringConfig): any;
        abstract detachText(text: Text): any;
        abstract extractDynamicPropertyConfig(el: WidgetElement): DynamicProperties;
        abstract extractDynamicStringConfig(content: string): DynamicStringConfig;
        abstract attachDynamicProperty(el: WidgetElement, dynamics: DynamicProperties): any;
        abstract detachDynamicProperty(el: WidgetElement): any;
        abstract getExistDynamicProperty(el: WidgetElement): DynamicProperties;
        abstract syncDynamicProperties(el: WidgetElement): any;
        abstract syncDynamicProperty(el: WidgetElement, name: string): any;
        abstract syncDynamicText(text: Text, rule: DynamicStringConfig): any;
        abstract attachDynamicText(text: Text, rule: DynamicStringConfig): any;
        abstract detachDynamicText(text: Text): any;
        abstract bindUI(node: WidgetElement, id: string): any;
        abstract unbindUI(id: string): any;
        abstract checkAndBindUI(el: WidgetElement): any;
        abstract checkAndUnbindUI(el: WidgetElement): any;
        protected abstract explain(config: DynamicValueConfig): any;
        abstract defineSlot(name: string, el: Element, dynamics: DynamicProperties): any;
        abstract fillSlots(slots: Slot[]): any;
        abstract defineSubWidget(name: string, el: WidgetElement, dynamics: DynamicProperties, slots: Slot[]): any;
        abstract setSubWidget(name: string, widget: any): any;
        abstract mergeProps(from: HTMLElement, to: HTMLElement, props: string[]): any;
        abstract defineList(name: string, el: HTMLElement): any;
        abstract extractTemplates(node: HTMLElement): {
            [index: string]: string;
        };
        abstract transferProperties(to: WidgetElement, dynamics: DynamicProperties): any;
    }
    abstract class WidgetInitializerDesign {
        protected widget: WidgetAny;
        constructor(widget: WidgetAny);
        abstract initTemplate(template?: WidgetTemplate): any;
        abstract traverseAndInitialize(node: WidgetElement | HTMLElement | Text): any;
        abstract createElement(tagName: string, properties: ElementConfigProperties, children: WidgetElement[]): WidgetElement;
        abstract createText(rule: DynamicStringConfig): any;
    }
    class WidgetCore extends WidgetCoreDesign {
        attachElement(el: WidgetElement, dynamics: DynamicProperties): WidgetElement;
        detachElement(el: WidgetElement): void;
        attachText(text: Text, config: DynamicStringConfig): void;
        detachText(text: Text): void;
        extractDynamicPropertyConfig(el: WidgetElement): DynamicProperties;
        getExistDynamicProperty(el: WidgetElement): DynamicProperties;
        syncDynamicProperties(el: WidgetElement): void;
        syncDynamicProperty(el: WidgetElement, propertyName: string): void;
        syncDynamicText(text: Text, rule: DynamicStringConfig): void;
        explain(config: DynamicValueConfig): any;
        checkAndUnbindUI(el: WidgetElement): void;
        checkAndBindUI(el: WidgetElement): void;
        bindUI(node: WidgetElement, id: string): void;
        unbindUI(id: string): void;
        defineSubWidget(name: string, el: WidgetElement, dynamics: DynamicProperties, slots: Slot[]): void;
        setSubWidget(name: string, widget: WidgetAny): void;
        attachDynamicProperty(el: WidgetElement, dynamics?: DynamicProperties): void;
        detachDynamicProperty(el: WidgetElement): void;
        attachDynamicText(text: Text, rule: DynamicStringConfig): void;
        detachDynamicText(text: Text): void;
        extractTemplates(node: HTMLElement): {};
        defineSlot(name: string, el: Element, dynamics: DynamicProperties): void;
        fillSlots(slots: Slot[]): void;
        extractDynamicStringConfig(content: string): DynamicStringConfig;
        mergeProps(from: HTMLElement, to: HTMLElement, props: string[]): void;
        transferProperties(to: WidgetElement, dynamics: DynamicProperties): void;
        defineList(name: string, el: HTMLElement): void;
        protected getPropsFromElement(el: HTMLElement): {};
        protected getChildrenAsSlot(el: HTMLElement): Slot[];
        protected getSlotHolder(name: string, index: number): {
            el: HTMLElement;
            name: string;
            dynamics: DynamicProperties;
            index: number;
        };
    }
    class WidgetInitializer extends WidgetInitializerDesign {
        initTemplate(template?: WidgetTemplate): any;
        traverseAndInitialize(node: WidgetElement | Text): void;
        createElement(tagName: string, properties: ElementConfigProperties, children: WidgetElement[]): WidgetElement;
        createText(rule: DynamicStringConfig): Text;
    }
    class WidgetDOMEventDelegator {
        readonly widget: any;
        constructor(widget: any);
        private lazyHandlers;
        private prepareUIDelegates(uiName);
        private prepareUIDelegate(uiName, eventName);
        private unbindLazyHandler(uiName, eventName);
        private bindLazyHandler(uiName, eventName);
        private provideLazyHandler(uiName, eventName, v);
        clearUIDelegateOwner(id: string): void;
        applyUIDelegateOwner(id: string): void;
        private delegateTo(name, event);
    }
}
declare namespace Leaf {
    class Widget<TUIs extends {
        [index: string]: HTMLElement;
    } = {
        [index: string]: HTMLElement;
    }, TVMs = {
        [key: string]: any;
    }> {
        template: WidgetTemplate;
        _VMFields: (keyof TVMs)[];
        static namespace: Namespace;
        static events: EventEmitter<{
            create: Widget<{
                [index: string]: HTMLElement;
            }, {
                [key: string]: any;
            }>;
        }>;
        namespace: Namespace;
        static setTemplate(template: WidgetTemplate): void;
        ListItemData: any;
        VM: TVMs;
        ViewModel: ViewModel<TVMs>;
        parent: WidgetAny;
        events: EventEmitter;
        UI: TUIs;
        node: WidgetElement;
        templates: {
            [index: string]: string;
        };
        providingEvents: DOMEventInfo[];
        interestingUnbubblingEvents: DOMEventInfo[];
        interestingBubblingEvents: DOMEventInfo[];
        readonly widgetName: string;
        readonly core: WidgetCoreDesign;
        readonly delegates: WidgetDOMEventDelegator;
        readonly initializer: WidgetInitializerDesign;
        toString(): string;
        before(who: WidgetAny | HTMLElement): boolean;
        after(who: WidgetAny | HTMLElement): boolean;
        prependTo(who: WidgetAny | HTMLElement): boolean;
        appendTo(who: WidgetAny | HTMLElement): boolean;
        constructor(template?: WidgetTemplate, name?: string, _VMFields?: (keyof TVMs)[]);
        static makeList<TListItem extends ListItem>(el: HTMLElement): List<TListItem>;
        protected emitDOMEvent(name: string, bubble: boolean, props?: any): void;
        protected emitWidgetEvent(name: string, value?: any): void;
        protected include(W: any): void;
        protected expose(name: string, remoteName?: string): void;
        protected makeList<T extends ListItem>(who: string | HTMLElement): List<T>;
    }
    abstract class GeneratedWidget<TUIs extends {
        [index: string]: HTMLElement;
    } = {
        [index: string]: HTMLElement;
    }, TVMs = {
        [key: string]: any;
    }> extends Widget<TUIs, TVMs> {
        private generator;
        _VMFields: (keyof TVMs)[];
        constructor(generator: Function, name: string, _VMFields?: (keyof TVMs)[]);
        GeneratedConstructor: WidgetConstructor;
        BindedWidgets: {
            path: string;
            name: string;
        }[];
        BindedLists: {
            name: string;
            type: "inline" | "reference" | "void" | string;
            reference: string;
        }[];
        TestDatas: {
            name: string;
            content: string;
            json: any;
        }[];
        InitialData: any;
        initGeneratedTemplate(node: WidgetElement): void;
        protected _e(tagName: string, properties: ElementConfigProperties, children: WidgetElement[]): WidgetElement;
        protected _t(rule: DynamicStringConfig): Text;
        renderRecursive(data?: any, R?: any): void;
        private resolveWidgetByPath(R, path);
    }
    interface StandaloneWidgetConstructor {
        new (): WidgetAny;
    }
    interface WidgetConstructor {
        new (el: HTMLElement): WidgetAny;
    }
    type WidgetAny = Widget;
}
declare namespace Leaf {
    class List<TListItem extends ListItem = ListItem> extends Widget {
        [index: number]: TListItem;
        ListItemConstructor: WidgetConstructor;
        constructor(el: HTMLElement);
        fill(datas: any[], Cons: WidgetConstructor): void;
        events: Leaf.EventEmitter<{
            "child/add": TListItem;
            "child/change": TListItem;
            "child/remove": TListItem;
        }>;
        private _length;
        length: number;
        forEach: (callbackFn: (item: TListItem, index?: number, array?: TListItem[]) => void) => void;
        some: (callbackFn: (item: TListItem, index?: number, array?: TListItem[]) => boolean) => boolean;
        every: (callbackFn: (item: TListItem, index?: number, array?: TListItem[]) => boolean) => boolean;
        map: (callbackFn: (item: TListItem, index?: number, array?: TListItem[]) => any) => any[];
        filter: (callbackFn: (item: TListItem, index?: number, array?: TListItem[]) => boolean) => TListItem[];
        slice: (start?: number, end?: number) => TListItem[];
        empty(): void;
        indexOf(item: TListItem): number;
        private check(item);
        push(...items: TListItem[]): void;
        pop(): TListItem;
        unshift(item: TListItem): number;
        shift(): TListItem;
        splice(index: number, count?: number, ...toAdd: TListItem[]): TListItem[];
        removeItem(item: TListItem): TListItem;
        private attach(item);
        private detach(item);
        toArray(): TListItem[];
    }
    interface ListItem<TUIs extends {
        [index: string]: HTMLElement;
    } = {
        [index: string]: HTMLElement;
    }, TVMs = {
        [key: string]: any;
    }> extends Widget<TUIs, TVMs> {
    }
}
declare namespace Leaf {
    type RPCId = number;
    const RPCErrors: ErrorsOf<{
        APINotExists: any;
        Timeout: any;
        Conflict: any;
        BrokenConnection: any;
    }>;
    interface RPCCallback<TResult> {
        (error: Error, result: TResult): void;
    }
    interface RPCInvoke<TOption, TResult> {
        (option?: TOption, callback?: RPCCallback<TResult>): void;
        RPC?: RPCDeclare<TOption, TResult>;
    }
    interface RPCOption {
        name: string;
        timeout?: number;
    }
    interface RPCMethodHandler {
        (data: any, callback: {
            (err?: Error, data?: any): void;
        }): void;
    }
    class RPCComposer<E = {}> {
        option: {
            defaultTimeout?: number;
        };
        declares: any;
        requestOffset: number;
        methods: {
            [index: string]: RPCMethodHandler;
        };
        remoteEvents: EventEmitter<{
            "*": {
                [K in keyof E]: E[K];
            };
        } & {
            [P in keyof E]: E[P];
        }>;
        private connection;
        private responseHandlers;
        customNormalize: {
            (data: any): string;
        };
        customDenormalize: {
            (data: string): any;
        };
        private allocateId();
        constructor(option?: {
            defaultTimeout?: number;
        });
        setConnection(con: RPCConnection): void;
        unsetConnection(): void;
        revokeRPCMethod(name: string): void;
        registerRPCMethod(name: string, handler: RPCMethodHandler): void;
        createRPCDeclare<TOption, TResult>(option: RPCOption): RPCDeclare<TOption, TResult>;
        createRPCInvokeInterface<TOption, TResult>(option: RPCOption): RPCInvoke<TOption, TResult>;
        emitRemoteEvent(name: string, data?: any): void;
        invoke(name: string, data: any, callback?: Function, option?: {
            timeout?: number;
        }): void;
        private send(data);
        private handleMessage(rawString);
        private handleInvoke(req);
        private handleResponse(res);
        private handleEvent(event);
        private transformObject(data, handler);
        private normalize(data);
        private denormalize(data);
        private finishHandler(id, err?, value?);
    }
    class RPCDeclare<TOption, TResult> {
        private center;
        private option;
        constructor(center: RPCComposer, option: RPCOption);
        getFunction(): RPCInvoke<TOption, TResult>;
        invoke(data?: TOption, callback?: RPCCallback<TResult>): void;
    }
    type RPCBaseConnectionMessage = string;
    interface RPCConnection {
        events: EventEmitter<{
            message: string;
            close: null;
        }>;
        send: {
            (data: string): void;
        };
    }
    abstract class RPCConnectionBase implements RPCConnection {
        events: EventEmitter<{
            message: string;
            close: null;
        }>;
        abstract send(data: string): void;
    }
    enum RPCProtocolBlobType {
        INVOKE = 1,
        RESPONSE = 2,
        EVENT = 3,
    }
    interface RPCResponseHandler {
        id: RPCId;
        callback: Function;
        timer: any;
        finished: boolean;
    }
    interface RPCProtocolBlob {
        type: RPCProtocolBlobType;
    }
    interface RPCProtocolResponseBlob extends RPCProtocolBlob {
        id: RPCId;
        data?: any;
        error?: any;
        type: RPCProtocolBlobType;
    }
    interface RPCProtocolInvokeBlob extends RPCProtocolBlob {
        id: RPCId;
        method: string;
        data: any;
        type: RPCProtocolBlobType;
    }
    interface RPCProtocolEventBlob extends RPCProtocolBlob {
        name: string;
        data: any;
        type: RPCProtocolBlobType;
    }
    class RPCBrowserWebSocketConnection extends RPCConnectionBase implements RPCConnection {
        connection: WebSocket;
        constructor(connection: WebSocket);
        send(content: string): void;
    }
}
declare namespace Leaf {
    namespace CoreLogic {
        function createDynamicValueConfigs(templateString: string): DynamicValueConfig[];
        const MergablePropertyNames: string[];
        function isPropertyMergable(name: string): boolean;
        function mergeProperty(name: string, values: string[]): string;
        const BubbleEvents: {
            name: string;
            bubble: boolean;
        }[];
        const UnbubbleEvents: {
            name: string;
            bubble: boolean;
            target: string[];
        }[];
        const AllEvents: {
            name: string;
            bubble: boolean;
        }[];
        function explainDynamicString(model: DataSource<any>, config: DynamicStringConfig): string;
        function explainDynamicValue(model: DataSource<any>, config: DynamicValueConfig): any;
    }
}
declare namespace Leaf {
    namespace Key {
        let cmd: number;
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        let e: number;
        let f: number;
        let g: number;
        let h: number;
        let i: number;
        let j: number;
        let k: number;
        let l: number;
        let m: number;
        let n: number;
        let o: number;
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        let t: number;
        let u: number;
        let v: number;
        let w: number;
        let x: number;
        let y: number;
        let z: number;
        let space: number;
        let shift: number;
        let ctrl: number;
        let alt: number;
        let left: number;
        let up: number;
        let right: number;
        let down: number;
        let enter: number;
        let backspace: number;
        let escape: number;
        let del: number;
        let esc: number;
        let pageup: number;
        let pagedown: number;
        let tab: number;
        let home: number;
        let end: number;
        let quote: number;
        let openBracket: number;
        let closeBracket: number;
        let backSlash: number;
        let slash: number;
        let equal: number;
        let comma: number;
        let period: number;
        let dash: number;
        let semiColon: number;
        let graveAccent: number;
    }
    namespace Mouse {
        let left: number;
        let middle: number;
        let right: number;
    }
}
declare namespace Leaf {
    function ValidatorRule(obj: any, name: string, descriptor: TypedPropertyDescriptor<Function>): void;
    class Validator<T = {
        [key: string]: any;
    }> {
        constructor();
        clone(): Validator<T>;
        fields: {
            [K in keyof T]?: Validator.FieldRule;
        };
        protected current: Validator.FieldRule;
        isReadonly: boolean;
        readonly(): this;
        field(name: keyof T): this;
        string(): this;
        number(): this;
        int(): this;
        exists(): this;
        gt(v: number): this;
        lt(v: number): this;
        match(reg: RegExp): this;
        is(value: any): this;
        custom(validate: (obj: any, name: string, value: any) => boolean): this;
        in(arr: any[]): this;
        annotation(data: any): this;
        error(error: Error): this;
        check(obj: any): this;
        protected isNone(a: any): boolean;
        protected checkers: {
            (field?: Validator.FieldRule, rule?: Validator.Rule, obj?: any, name?: string, value?: any): boolean;
        }[];
        protected checkRule(field: Validator.FieldRule, rule: Validator.Rule, obj: any, name: string, value: any): boolean;
        explain(): this;
    }
    const DataDefinition: typeof Validator;
    namespace Validator {
        const Errors: ErrorsOf<{
            DuplicateRule: {};
            RequireFieldSpecification: {};
            Empty: {};
            Readonly: {};
        }>;
        function create<T = {
            [key: string]: any;
        }>(): Validator<T>;
        interface FieldRule {
            field: string;
            rules: Rule[];
            error?: Error;
        }
        interface Rule {
            type: string;
            error?: Error;
        }
    }
}
declare namespace Leaf {
    class ServiceStateModel<TState = {
        [key: string]: any;
    }> extends DataSource<TState> {
        constructor(service: Service, fields?: (keyof TState)[]);
    }
    type AnyService = Service;
    abstract class Service<TState = {
        [key: string]: any;
    }, TEvents = {
        [key: string]: any;
    }> {
        isInitialized: boolean;
        readonly dependencies: string[];
        abstract name: string;
        initialize(...args: any[]): void;
        stateModel: ServiceStateModel<TState>;
        constructor();
        abstract states: TState;
        events: EventEmitter<TEvents>;
        services: {
            [name: string]: AnyService;
        };
        private apiNames;
        connect(delegator: {
            invoke: (uri: string, data: any, callback: Function) => void;
        }): void;
        private bindAPINames();
        private api;
        createAPI<TOption, TResult>(handler?: (option: TOption, callback: (err?: Error, result?: TResult) => void) => void): {
            (option?: TOption, callback?: (err: Error, result: TResult) => void): void;
        };
    }
    interface TaggedFunction {
        tag?: "api";
        api?: string;
    }
    type DependencyMatcher = string | RegExp;
    class DependencyManager {
        private context;
        add(name: string, deps: DependencyMatcher[]): void;
        onAddDymanicDependency: (name: string) => void;
        resolveDependency(name: string, chain?: string[]): string[];
        resolve(): string[];
    }
    class ServiceSetupProcedure extends Leaf.States<string, string> {
        private services;
        private setupSequence;
        constructor(services: {
            [key: string]: AnyService;
        }, setupSequence: string[]);
        protected data: {
            dones?: Function[];
            todo?: string[];
        };
        setup(callback: (err: Error) => void): void;
        atPrepare(): void;
        atSetup(): void;
        atFinish(): void;
        atPanic(): void;
        private logInitialized(name);
    }
    class ServiceContext {
        private settings;
        private BuiltInServiceInstances;
        constructor(settings?: any);
        services: {
            [index: string]: AnyService;
        };
        dependencyManager: DependencyManager;
        register<T extends AnyService>(s: T): T;
        private procedure;
        setup(callback: (err: Error) => void): void;
    }
}
declare namespace Leaf {
    namespace Background {
        class ChannelBackgroundEnd {
        }
        class BackgroundLayer {
            version: string;
            private context;
            constructor(version?: string);
        }
    }
}
declare namespace Leaf {
    namespace Foreground {
        class ChannelForegroundEnd {
        }
        class ChannelForegroundLayer {
            version: string;
            private context;
            private rpc;
            private invokeBackgroundServiceAPI;
            private connectBackgroundLayer;
            constructor(version?: string);
        }
    }
}
declare namespace Leaf {
    interface ApplicationLifeCircle {
        foregroundInitialize: () => void;
        backgroundInitialize: () => void;
    }
    abstract class Application implements ApplicationLifeCircle {
        initialize(): void;
        implements(lifecircle: Partial<ApplicationLifeCircle>): void;
        foregroundInitialize: () => void;
        backgroundInitialize: () => void;
        serviceContext: ServiceContext;
    }
}
declare namespace Leaf {
}
