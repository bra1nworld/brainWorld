import { LoadingBehavior } from "./loadingBehavior"
export abstract class LoginBehavior {
    events = new Leaf.EventEmitter<{ authorized }>()
    constructor(private widget: {
        UI: {
            loginButton: HTMLElement
            loginInput: HTMLInputElement
            loginPasswordInput: HTMLInputElement
        }
        VM: {
            error?: boolean
            errorText?: string
            // used by loading behavior
            loading?: boolean
        }
        onClickLoginButton?: Function
        asLoading?: LoadingBehavior
    }) {
        this.widget.onClickLoginButton = () => {
            this.login()
        }
    }
    asLoading = this.widget.asLoading || new LoadingBehavior(this.widget)
    i18n = {
        InvalidLoginOrPassword: "Invalid login or password."
    }
    Errors = Leaf.ErrorDoc.create()
        .define("InvalidUsernameOrEmail")
        .define("InvalidPassword")
        .define("InvalidLoginOrPassword")
        .generate() as Leaf.ErrorsOf<{
            InvalidUsernameOrEmail: {}
            InvalidPassword: {}
            InvalidLoginOrPassword: {}
        }>
    private validator = Leaf.Validator.create()
        .field("login").error(new this.Errors.InvalidUsernameOrEmail).string().exists().gt(1)
        .field("password").error(new this.Errors.InvalidPassword).string().exists().gt(1)
        .readonly()
    private getOption() {
        let password = this.widget.UI.loginPasswordInput.value.trim()
        let login = this.widget.UI.loginInput.value.trim()
        let option = { password, login }
        return option
    }
    public check() {
        let option = this.getOption()
        try {
            this.validator.check(option)
        } catch (e) {
            this.widget.VM.error = true
            this.widget.VM.errorText = this.i18n.InvalidLoginOrPassword
            return null
        }
        this.widget.VM.error = false
        this.widget.VM.errorText = ""
        return option
    }
    public getOptionIfValid() {
        return this.check()
    }
    public login() {
        if (this.asLoading.isLoading) return
        let option = this.getOptionIfValid()
        if (!option) return false
        this.asLoading.start()
        this.handleLogin(option, (err: Error) => {
            this.asLoading.finish()
            if (err) {
                this.widget.VM.error = true
                this.widget.VM.errorText = err.message
                return
            }
            this.events.emit("authorized")
        })
    }
    public reset() {
        this.widget.UI.loginInput.value = ""
        this.widget.UI.loginPasswordInput.value = ""
        this.widget.VM.error = false
        this.widget.VM.errorText = ""
        this.asLoading.reset()
    }
    abstract handleLogin(option: { login: string, password: string }, callback: (err: Error) => void);
}
