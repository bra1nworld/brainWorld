import { FastClick } from "./lib/fastclick"
import * as Settings from "./settings"
import { APIService } from "./service/apiService"
import { AnnotationScene } from "./view/annotationScene"
import { RouteService } from "./lib/service/routeService"
import { SiteLayout } from "./view/siteLayout"
import { LoadingModal } from "./view/loadingModal"

import { Authenticator } from "./view/authenticator"

import { AnnotatingTaskManager } from "./view/annotatingTaskManager"
import { PendingTaskManager } from "./view/pendingTaskManager"
import { CheckAnnotatedTaskManager } from "./view/checkAnnotatedTaskManager"
import { DoneTaskManager } from "./view/doneTaskManager"
import { MyAnnotatingTaskManager } from "./view/myAnnotatingTaskManager"
import { MyAnnotatedTaskManager } from "./view/myAnnotatedTaskManager"
import { MyCheckingTaskManager } from "./view/myCheckingTaskManager"
import { MyCheckedTaskManager } from "./view/myCheckedTaskManager"

class Application {
    events = new Leaf.EventEmitter<{
        initializing
        initialized
    }>()
    siteLayout: SiteLayout
    loadingModal: LoadingModal
    constructor() {
    }
    user: User
    services = new Leaf.ServiceContext()
    api = this.services.register(new APIService())
    route = this.services.register(new RouteService())
    initialize() {
        this.events.emit("initializing")
        // Solve mobile problem
        FastClick.attach(document.body);

        App.api.getEnvironmentInformation({}, (err, user) => {
            if (err) {
                console.error(err)
                return
            }
            this.user = user
            if (!user) {
                let authenticator = new Authenticator()
                document.body.appendChild(authenticator.node)
                return
            }
            this.siteLayout = new SiteLayout(this.user)
            document.body.appendChild(this.siteLayout.node)
            this.events.emit("initialized")
        })

        // this.services.setup(() => {
        //     this.route.route("/task/:sceneId/:frameIndex", (params) => {
        //         console.log(params, "??")
        //         let scene = new AnnotationScene(params.sceneId, parseInt(params.frameIndex))
        //         scene.appendTo(document.body)
        //         scene.render()
        //         window["scene"] = scene
        //     })
        //     this.route.handle(window.location.toString())
        // })

    }
    openEntry(uri: string): boolean {
        let EntryView = EntryMap[uri]
        if (!EntryView) {
            console.error(`${uri} entry does not defined in entry map`)
            return false
        }
        let entry = new EntryView()
        this.siteLayout.visit(entry.node)
        return true
    }
    loading(loading: boolean = true) {
        if (loading) {
            if (!this.loadingModal) {
                this.loadingModal = new LoadingModal()
            }
            this.loadingModal.show()
            return
        }
        setTimeout(() => {
            if (App.loadingModal) {
                App.loadingModal.hide()
                App.loadingModal = null
            }
        }, 30)
    }
}
export const EntryMap: {[K in keyof Privilege]?: Leaf.WidgetConstructor } = {
    pendingTask: PendingTaskManager,
    annotatingTask: AnnotatingTaskManager,
    checkAnnotatedTask: CheckAnnotatedTaskManager,
    doneTask: DoneTaskManager,
    myAnnotatingTask: MyAnnotatingTaskManager,
    myAnnotatedTask: MyAnnotatedTaskManager,
    myCheckingTask: MyCheckingTaskManager,
    myCheckedTask: MyCheckedTaskManager,
}
export const App = new Application()
