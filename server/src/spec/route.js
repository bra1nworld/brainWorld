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
var route_1 = require("root-ts/lib/route");
var route_2 = require("root-ts/lib/route");
var RouteService = /** @class */ (function (_super) {
    __extends(RouteService, _super);
    function RouteService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dependencies = ["ExpressService", "MongodbService", "RouteSessionService"];
        return _this;
    }
    return RouteService;
}(route_2.RouteServiceTemplate));
exports.RouteService = RouteService;
var APIBase = /** @class */ (function (_super) {
    __extends(APIBase, _super);
    function APIBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return APIBase;
}(route_1.APIBase));
exports.APIBase = APIBase;
var EchoAPIServiceSpec = /** @class */ (function (_super) {
    __extends(EchoAPIServiceSpec, _super);
    function EchoAPIServiceSpec() {
        return _super.call(this, EchoAPIService) || this;
    }
    return EchoAPIServiceSpec;
}(RouteService));
exports.EchoAPIServiceSpec = EchoAPIServiceSpec;
var EchoAPIService;
(function (EchoAPIService) {
    EchoAPIService.prefix = "/api/";
    EchoAPIService.name = "api.echo";
    EchoAPIService.API = {
        echo: new /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.path = "echo/:name/GET";
                _this.method = "POST";
                return _this;
            }
            return class_1;
        }(APIBase))
    };
})(EchoAPIService || (EchoAPIService = {}));
var AnnotationAPIServiceSpec = /** @class */ (function (_super) {
    __extends(AnnotationAPIServiceSpec, _super);
    function AnnotationAPIServiceSpec() {
        return _super.call(this, AnnotationAPIService) || this;
    }
    return AnnotationAPIServiceSpec;
}(RouteService));
exports.AnnotationAPIServiceSpec = AnnotationAPIServiceSpec;
var AnnotationAPIService;
(function (AnnotationAPIService) {
    AnnotationAPIService.prefix = "/api/";
    AnnotationAPIService.name = "api.annotation";
    AnnotationAPIService.API = {
        getSceneFrameAnnotations: new /** @class */ (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.path = "annotation/:sceneId/:frameIndex/GET";
                _this.method = "POST";
                return _this;
            }
            return class_2;
        }(APIBase)),
        saveFrameAnnotation: new /** @class */ (function (_super) {
            __extends(class_3, _super);
            function class_3() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.path = "annotation/:sceneId/:frameIndex";
                _this.method = "PUT";
                return _this;
            }
            return class_3;
        }(APIBase))
    };
})(AnnotationAPIService || (AnnotationAPIService = {}));
var SceneFrameAPIServiceSpec = /** @class */ (function (_super) {
    __extends(SceneFrameAPIServiceSpec, _super);
    function SceneFrameAPIServiceSpec() {
        return _super.call(this, SceneFrameAPIService) || this;
    }
    return SceneFrameAPIServiceSpec;
}(RouteService));
exports.SceneFrameAPIServiceSpec = SceneFrameAPIServiceSpec;
var SceneFrameAPIService;
(function (SceneFrameAPIService) {
    SceneFrameAPIService.prefix = "/api/";
    SceneFrameAPIService.name = "api.frame";
    SceneFrameAPIService.API = {
        getSceneFrame: new /** @class */ (function (_super) {
            __extends(class_4, _super);
            function class_4() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.path = "frame/:sceneId/:frameIndex";
                _this.method = "POST";
                return _this;
            }
            return class_4;
        }(APIBase)),
        getUnannotatedSceneFrame: new /** @class */ (function (_super) {
            __extends(class_5, _super);
            function class_5() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.path = "frame";
                _this.method = "POST";
                return _this;
            }
            return class_5;
        }(APIBase))
    };
})(SceneFrameAPIService || (SceneFrameAPIService = {}));
var AnnotatingTaskAPIServiceSpec = /** @class */ (function (_super) {
    __extends(AnnotatingTaskAPIServiceSpec, _super);
    function AnnotatingTaskAPIServiceSpec() {
        return _super.call(this, AnnotatingTaskAPIService) || this;
    }
    return AnnotatingTaskAPIServiceSpec;
}(RouteService));
exports.AnnotatingTaskAPIServiceSpec = AnnotatingTaskAPIServiceSpec;
var AnnotatingTaskAPIService;
(function (AnnotatingTaskAPIService) {
    AnnotatingTaskAPIService.prefix = "/api/";
    AnnotatingTaskAPIService.name = "api.annotatingTask";
    AnnotatingTaskAPIService.API = {
        queryAnnotatingTasks: new /** @class */ (function (_super) {
            __extends(class_6, _super);
            function class_6() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "annotatingTask/paginate";
                return _this;
            }
            return class_6;
        }(APIBase)),
        getAnnotatingTaskById: new /** @class */ (function (_super) {
            __extends(class_7, _super);
            function class_7() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "annotatingTask/:id/get";
                return _this;
            }
            return class_7;
        }(APIBase)),
        applyAnnotatingTask: new /** @class */ (function (_super) {
            __extends(class_8, _super);
            function class_8() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "annotatingTask/apply";
                return _this;
            }
            return class_8;
        }(APIBase)),
        pendingAnnotatingTask: new /** @class */ (function (_super) {
            __extends(class_9, _super);
            function class_9() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "annotatingTask/:id/pending";
                return _this;
            }
            return class_9;
        }(APIBase)),
        confirmAnnotatingTask: new /** @class */ (function (_super) {
            __extends(class_10, _super);
            function class_10() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "annotatingTask/:id/confirm";
                return _this;
            }
            return class_10;
        }(APIBase)),
        createTestData: new /** @class */ (function (_super) {
            __extends(class_11, _super);
            function class_11() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "annotatingTask/testData";
                return _this;
            }
            return class_11;
        }(APIBase)),
    };
})(AnnotatingTaskAPIService || (AnnotatingTaskAPIService = {}));
var CheckingTaskAPIServiceSpec = /** @class */ (function (_super) {
    __extends(CheckingTaskAPIServiceSpec, _super);
    function CheckingTaskAPIServiceSpec() {
        return _super.call(this, CheckingTaskAPIService) || this;
    }
    return CheckingTaskAPIServiceSpec;
}(RouteService));
exports.CheckingTaskAPIServiceSpec = CheckingTaskAPIServiceSpec;
var CheckingTaskAPIService;
(function (CheckingTaskAPIService) {
    CheckingTaskAPIService.prefix = "/api/";
    CheckingTaskAPIService.name = "api.checkingTask";
    CheckingTaskAPIService.API = {
        queryCheckingTasks: new /** @class */ (function (_super) {
            __extends(class_12, _super);
            function class_12() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "checkingTask/paginate";
                return _this;
            }
            return class_12;
        }(APIBase)),
        applyCheckingTask: new /** @class */ (function (_super) {
            __extends(class_13, _super);
            function class_13() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "checkingTask/apply";
                return _this;
            }
            return class_13;
        }(APIBase)),
        confirmCheckingTask: new /** @class */ (function (_super) {
            __extends(class_14, _super);
            function class_14() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "checkingTask/:id/confirm";
                return _this;
            }
            return class_14;
        }(APIBase)),
    };
})(CheckingTaskAPIService || (CheckingTaskAPIService = {}));
var FrameTaskAPIServiceSpec = /** @class */ (function (_super) {
    __extends(FrameTaskAPIServiceSpec, _super);
    function FrameTaskAPIServiceSpec() {
        return _super.call(this, FrameTaskAPIService) || this;
    }
    return FrameTaskAPIServiceSpec;
}(RouteService));
exports.FrameTaskAPIServiceSpec = FrameTaskAPIServiceSpec;
var FrameTaskAPIService;
(function (FrameTaskAPIService) {
    FrameTaskAPIService.prefix = "/api/";
    FrameTaskAPIService.name = "api.frameTask";
    FrameTaskAPIService.API = {
        queryFrameTasks: new /** @class */ (function (_super) {
            __extends(class_15, _super);
            function class_15() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "frameTask/paginate";
                return _this;
            }
            return class_15;
        }(APIBase)),
        updateFrameTask: new /** @class */ (function (_super) {
            __extends(class_16, _super);
            function class_16() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "frameTask/:id/update";
                return _this;
            }
            return class_16;
        }(APIBase)),
        getFrameAnnotatesById: new /** @class */ (function (_super) {
            __extends(class_17, _super);
            function class_17() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "frameTask/:id/getById";
                return _this;
            }
            return class_17;
        }(APIBase)),
        getFrameTaskById: new /** @class */ (function (_super) {
            __extends(class_18, _super);
            function class_18() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "frameTask/:id/getFrame";
                return _this;
            }
            return class_18;
        }(APIBase)),
        findFrameTasks: new /** @class */ (function (_super) {
            __extends(class_19, _super);
            function class_19() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "frameTask/find";
                return _this;
            }
            return class_19;
        }(APIBase)),
        getFramePoints: new /** @class */ (function (_super) {
            __extends(class_20, _super);
            function class_20() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "frameTask/getPoints";
                return _this;
            }
            return class_20;
        }(APIBase)),
        getBagInfo: new /** @class */ (function (_super) {
            __extends(class_21, _super);
            function class_21() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "frameTask/bagInfo";
                return _this;
            }
            return class_21;
        }(APIBase))
    };
})(FrameTaskAPIService || (FrameTaskAPIService = {}));
var UserAPIServiceSpec = /** @class */ (function (_super) {
    __extends(UserAPIServiceSpec, _super);
    function UserAPIServiceSpec() {
        return _super.call(this, UserAPIService) || this;
    }
    return UserAPIServiceSpec;
}(RouteService));
exports.UserAPIServiceSpec = UserAPIServiceSpec;
var UserAPIService;
(function (UserAPIService) {
    UserAPIService.prefix = "/api/";
    UserAPIService.name = "api.user";
    UserAPIService.API = {
        getUserById: new /** @class */ (function (_super) {
            __extends(class_22, _super);
            function class_22() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "user/:id/getUser";
                return _this;
            }
            return class_22;
        }(APIBase)),
        getUser: new /** @class */ (function (_super) {
            __extends(class_23, _super);
            function class_23() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "user/getUser";
                return _this;
            }
            return class_23;
        }(APIBase)),
        login: new /** @class */ (function (_super) {
            __extends(class_24, _super);
            function class_24() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "user/login";
                return _this;
            }
            return class_24;
        }(APIBase)),
        logout: new /** @class */ (function (_super) {
            __extends(class_25, _super);
            function class_25() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "DELETE";
                _this.path = "user/logout";
                return _this;
            }
            return class_25;
        }(APIBase)),
        getEnvironmentInformation: new /** @class */ (function (_super) {
            __extends(class_26, _super);
            function class_26() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.method = "POST";
                _this.path = "user/environment";
                return _this;
            }
            return class_26;
        }(APIBase))
    };
})(UserAPIService || (UserAPIService = {}));
//# sourceMappingURL=route.js.map