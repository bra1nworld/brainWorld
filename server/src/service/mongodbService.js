"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceSpec = require("../spec/service");
var MongodbService = /** @class */ (function (_super) {
    __extends(MongodbService, _super);
    function MongodbService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MongodbService.prototype.initialize = function (done) {
        var _this = this;
        _super.prototype.initialize.call(this, function () {
            _this.annotationCollection = _this.db.collection("annotation");
            _this.annotationCollection.createIndex({
                frameIndex: 1,
                sceneId: 1
            }, {
                unique: true
            });
            done();
        });
    };
    return MongodbService;
}(ServiceSpec.MongodbService));
exports.MongodbService = MongodbService;
//# sourceMappingURL=mongodbService.js.map