"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastclick_1 = require("./lib/fastclick");
var apiService_1 = require("./service/apiService");
var annotationScene_1 = require("./view/annotationScene/annotationScene");
var routeService_1 = require("./lib/service/routeService");
var loadingModal_1 = require("./view/loadingModal");
var Application = /** @class */ (function () {
    function Application() {
        this.events = new Leaf.EventEmitter();
        this.services = new Leaf.ServiceContext();
        this.api = this.services.register(new apiService_1.APIService());
        this.route = this.services.register(new routeService_1.RouteService());
    }
    Application.prototype.initialize = function () {
        this.events.emit("initializing");
        // Solve mobile problem
        fastclick_1.FastClick.attach(document.body);
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
        var scene = new annotationScene_1.AnnotationScene({}, function () { });
        scene.appendTo(document.body);
        scene.render();
    };
    Application.prototype.loading = function (loading) {
        if (loading === void 0) { loading = true; }
        if (loading) {
            if (!this.loadingModal) {
                this.loadingModal = new loadingModal_1.LoadingModal();
            }
            this.loadingModal.show();
            return;
        }
        setTimeout(function () {
            if (exports.App.loadingModal) {
                exports.App.loadingModal.hide();
                exports.App.loadingModal = null;
            }
        }, 30);
    };
    return Application;
}());
exports.App = new Application();
