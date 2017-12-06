import { App } from "../app"
export class Authenticator extends R.Authenticator {
    constructor() {
        super()
        this.UI.passwordInput.onkeyup = (e) => {
            let theEvent = e || window.event as any;
            let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                this.login()
            }
        }
    }
    onClickLogin() {
        this.login()
    }
    login() {
        let option = {
            username: this.UI.loginInput.value.trim(),
            password: this.UI.passwordInput.value.trim()
        }
        App.api.login(option, (err, user) => {
            if (user) {
                // if (!user.available && user.username !== "admin" && user.password !== "admin") {
                //     alert("该账号已被冻结，请联系管理员。")
                //     return
                // }
                window.location.reload()
            } else {
                console.error(err)
                alert("账号或密码错误")
            }
        })
    }
}
