import { SiteHeader } from "./siteHeader"
import { SiteSider } from "./siteSider"
export class SiteLayout extends R.SiteLayout {
    siteHeader = new SiteHeader()
    siteSider: SiteSider
    constructor(user: User) {
        super()
        let privilege;
        switch (user.role) {
            case "worker":
                privilege = {
                    myAnnotatingTask: true,
                    myAnnotatedTask: true,
                }
                break
            case "checker":
                privilege = {
                    myCheckingTask: true,
                    myCheckedTask: true,
                }
                break
            case "admin":
                privilege = {
                    pendingTask: true,
                    annotatingTask: true,
                    checkAnnotatedTask: true,
                    doneTask: true,
                    userManagement: true
                }
                break
        }
        if (user.id == "admin") {
            privilege = {
                pendingTask: true,
                annotatingTask: true,
                checkAnnotatedTask: true,
                doneTask: true,
                myAnnotatingTask: true,
                myAnnotatedTask: true,
                myCheckingTask: true,
                myCheckedTask: true,
                userManagement: true
            }
        }
        this.siteSider = new SiteSider(privilege)
    }
    hide(hidden: boolean = true) {
        this.VM.hidden = hidden
    }
    visit(node: HTMLElement) {
        if (this.UI.siteContent.childNodes[0]) {
            this.UI.siteContent.removeChild(this.UI.siteContent.childNodes[0])
        }
        this.UI.siteContent.appendChild(node)
    }
}