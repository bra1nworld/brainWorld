import { LoadingBehavior } from "./loadingBehavior"
export abstract class RegisterBehavior {
    events = new Leaf.EventEmitter<{ authorized }>()
    constructor(private widget: {
        UI: {
            registerButton: HTMLElement
            registerUsernameInput: HTMLInputElement
            registerPasswordInput: HTMLInputElement
            registerPasswordConfirmInput: HTMLInputElement
            registerEmailInput: HTMLInputElement
        }
        VM: {
            error?: boolean
            loading?: boolean
            errorText?: string
        }
        onClickRegisterButton?: Function
        onChangeRegisterInput?: Function
        onChangeRegisterPassword?: Function
        asLoading?: LoadingBehavior
    }) {
        this.widget.onClickRegisterButton = () => {
            this.register()
        }
    }
    asLoading = this.widget.asLoading || new LoadingBehavior(this.widget)
    i18n = {
        InvalidUsername: "Invalid username.",
        InvalidPassword: "Invalid Password.",
        InvalidEmail: "Invalid email address.",
        PasswordMismatch: "Confirm password mismatch",
    }
    Errors = Leaf.ErrorDoc.create()
        .define("InvalidUsername")
        .define("InvalidEmail")
        .define("InvalidPassword")
        .define("PasswordMismatch")
        .generate() as Leaf.ErrorsOf<{
            InvalidUsername: {}
            InvalidEmail: {}
            InvalidPassword: {}
            PasswordMismatch: {}
        }>
    private validator = Leaf.Validator.create()
        .field("username").error(new this.Errors.InvalidUsername(this.i18n.InvalidUsername)).string().exists().gt(2).lt(257)
        .field("password").error(new this.Errors.InvalidPassword(this.i18n.InvalidPassword)).string().exists().gt(1)
        .field("email").error(new this.Errors.InvalidEmail(this.i18n.InvalidUsername)).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .readonly()
    private getOption() {
        let password = this.widget.UI.registerPasswordInput.value.trim()
        let username = this.widget.UI.registerUsernameInput.value.trim()
        let email = this.widget.UI.registerEmailInput.value.trim()
        let option = { password, username, email }
        return option
    }
    public getOptionIfValid() {
        let option = this.getOption()
        try {
            this.validator.check(option)
            if (this.widget.UI.registerPasswordInput.value !== this.widget.UI.registerPasswordConfirmInput.value) {
                throw new this.Errors.PasswordMismatch(this.i18n.PasswordMismatch)
            }
        } catch (e) {
            this.widget.VM.error = true
            this.widget.VM.errorText = e.message
            return null
        }
        this.widget.VM.error = false
        this.widget.VM.errorText = ""
        return option
    }
    public register() {
        if (this.asLoading.isLoading) return
        let option = this.getOptionIfValid()
        if (!option) return false
        this.asLoading.start()
        this.handleRegister(option, (err: Error) => {
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
        this.widget.UI.registerEmailInput.value = ""
        this.widget.UI.registerPasswordInput.value = ""
        this.widget.UI.registerPasswordConfirmInput.value = ""
        this.widget.UI.registerUsernameInput.value = ""
        this.widget.VM.error = false
        this.widget.VM.errorText = ""
        this.asLoading.reset()
    }
    abstract handleRegister(option: { username: string, password: string, email: string }, callback: (err: Error) => void);
}
