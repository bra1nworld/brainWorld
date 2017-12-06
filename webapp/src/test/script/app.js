"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastclick_1 = require("./lib/fastclick");
var apiService_1 = require("./service/apiService");
var Application = /** @class */ (function () {
    function Application() {
        this.events = new Leaf.EventEmitter();
        this.services = new Leaf.ServiceContext();
        this.api = this.services.register(new apiService_1.APIService());
    }
    Application.prototype.initialize = function () {
        var _this = this;
        this.events.emit("initializing");
        // Solve mobile problem
        fastclick_1.FastClick.attach(document.body);
        // All other code goes here
        this.events.emit("initialized");
        this.services.setup(function () {
            // Invoke echo api service
            _this.api.Echo.echo({
                name: "name",
                content: "QAQ"
            }, function (err, result) {
                console.log(err, result);
            });
        });
    };
    return Application;
}());
exports.App = new Application();
