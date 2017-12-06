import { FastClick } from "./lib/fastclick"
import * as Settings from "./settings"
import { APIService } from "./service/apiService"
import { AnnotationScene } from "./view/annotationScene/annotationScene"
import { RouteService } from "./lib/service/routeService"
import { SiteLayout } from "./view/siteLayout"
import { LoadingModal } from "./view/loadingModal"

import { Authenticator } from "./view/authenticator"


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

        // App.api.getEnvironmentInformation({}, (err, user) => {
        //     if (err) {
        //         console.error(err)
        //         return
        //     }
        //     this.user = user
        //     if (!user) {
        //         let authenticator = new Authenticator()
        //         document.body.appendChild(authenticator.node)
        //         return
        //     }
        //     this.siteLayout = new SiteLayout(this.user)
        //     document.body.appendChild(this.siteLayout.node)
        //     this.events.emit("initialized")
        // })
        let scene = new AnnotationScene({}, () => { })
        scene.appendTo(document.body)
        scene.render()
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

export const App = new Application()
