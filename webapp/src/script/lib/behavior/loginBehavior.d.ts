import { LoadingBehavior } from "./loadingBehavior";
export declare abstract class LoginBehavior {
    private widget;
    events: Leaf.EventEmitter<{
        authorized: any;
    }>;
    constructor(widget: {
        UI: {
            loginButton: HTMLElement;
            loginInput: HTMLInputElement;
            loginPasswordInput: HTMLInputElement;
        };
        VM: {
            error?: boolean;
            errorText?: string;
            loading?: boolean;
        };
        onClickLoginButton?: Function;
        asLoading?: LoadingBehavior;
    });
    asLoading: LoadingBehavior;
    i18n: {
        InvalidLoginOrPassword: string;
    };
    Errors: Leaf.ErrorsOf<{
        InvalidUsernameOrEmail: {};
        InvalidPassword: {};
        InvalidLoginOrPassword: {};
    }>;
    private validator;
    private getOption();
    check(): {
        password: string;
        login: string;
    };
    getOptionIfValid(): {
        password: string;
        login: string;
    };
    login(): boolean;
    reset(): void;
    abstract handleLogin(option: {
        login: string;
        password: string;
    }, callback: (err: Error) => void): any;
}
