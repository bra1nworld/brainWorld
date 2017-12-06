import { LoadingBehavior } from "./loadingBehavior";
export declare abstract class RegisterBehavior {
    private widget;
    events: Leaf.EventEmitter<{
        authorized: any;
    }>;
    constructor(widget: {
        UI: {
            registerButton: HTMLElement;
            registerUsernameInput: HTMLInputElement;
            registerPasswordInput: HTMLInputElement;
            registerPasswordConfirmInput: HTMLInputElement;
            registerEmailInput: HTMLInputElement;
        };
        VM: {
            error?: boolean;
            loading?: boolean;
            errorText?: string;
        };
        onClickRegisterButton?: Function;
        onChangeRegisterInput?: Function;
        onChangeRegisterPassword?: Function;
        asLoading?: LoadingBehavior;
    });
    asLoading: LoadingBehavior;
    i18n: {
        InvalidUsername: string;
        InvalidPassword: string;
        InvalidEmail: string;
        PasswordMismatch: string;
    };
    Errors: Leaf.ErrorsOf<{
        InvalidUsername: {};
        InvalidEmail: {};
        InvalidPassword: {};
        PasswordMismatch: {};
    }>;
    private validator;
    private getOption();
    getOptionIfValid(): {
        password: string;
        username: string;
        email: string;
    };
    register(): boolean;
    reset(): void;
    abstract handleRegister(option: {
        username: string;
        password: string;
        email: string;
    }, callback: (err: Error) => void): any;
}
