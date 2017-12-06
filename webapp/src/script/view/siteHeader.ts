import { App } from "../app";
export class SiteHeader extends R.SiteHeader {
    constructor() {
        super();
        App.api.getEnvironmentInformation({}, (err, user) => {
            this.VM.userName = user.username
        })
    }
    onClickLogout() {
        if (window.confirm("确定退出？")) {
            App.api.logout({}, err => {
                if (err) {
                    console.error(err);
                    return;
                }
                window.location.reload();
            });
        }
    }
}
