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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RouteSpec = require("../spec/route");
var errors_1 = require("../errors");
var CheckingTaskAPIService = /** @class */ (function (_super) {
    __extends(CheckingTaskAPIService, _super);
    function CheckingTaskAPIService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckingTaskAPIService.prototype.initialize = function () {
        var _this = this;
        this.api("queryCheckingTasks", function (ctx) {
            _this.services.CheckingTaskService.queryCheckingTasks(ctx.body, function (err, result) {
                if (err) {
                    console.log(err);
                    ctx.done(err, null);
                    return;
                }
                ctx.done(err, result);
            });
        });
        this.api("applyCheckingTask", function (ctx) {
            _this.services.AnnotatingTaskService.findAnnotatingTasks({
                state: "annotated"
            }, function (err, annotatingTasks) {
                if (err) {
                    console.log(err);
                    ctx.done(err, true);
                    return;
                }
                if (annotatingTasks.length < 1) {
                    ctx.done(null, false);
                    return;
                }
                var task = annotatingTasks[0];
                _this.services.AnnotatingTaskService.updateAnnotatingTaskById({
                    id: task.id,
                    updates: { state: "checking" }
                }, function (err, updateResult) {
                    if (err) {
                        console.log(err);
                        ctx.done(err, true);
                        return;
                    }
                    _this.services.UserService.getUserById({ id: ctx.body.checkerId }, function (err, user) {
                        if (err) {
                            console.log(err);
                            ctx.done(err, true);
                            return;
                        }
                        _this.services.CheckingTaskService.createCheckingTask({
                            annotatingTaskId: task.id,
                            checkerId: ctx.body.checkerId,
                            checkerName: user.username
                        }, function (err, result) {
                            if (err) {
                                console.log(err);
                                ctx.done(err, true);
                                return;
                            }
                            ctx.done(null, true);
                        });
                    });
                });
            });
        });
        this.api("confirmCheckingTask", function (ctx) {
            _this.confirmCheckingTask(ctx);
        });
        this.installTo(this.services.ExpressService.server);
    };
    CheckingTaskAPIService.prototype.confirmCheckingTask = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var frames, hasErrorResult, tasks, currentAnnotationTask, annotationTaskUpdates, checkTaskUpdates, errorInfo, updateAnnotationTaskOption, updateCheckTaskOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findFrameUncheckedTasks(ctx)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.findFrameHasErrorTasks(ctx)];
                    case 2:
                        frames = _a.sent();
                        hasErrorResult = frames;
                        return [4 /*yield*/, this.getCurrentAnnotationTask(ctx)];
                    case 3:
                        tasks = _a.sent();
                        currentAnnotationTask = tasks;
                        checkTaskUpdates = {
                            state: "checked",
                            endTime: new Date(),
                            annotationErrors: [],
                            frameErrors: []
                        };
                        if (hasErrorResult.length > 0) {
                            annotationTaskUpdates = { state: "hasError" };
                            hasErrorResult.forEach(function (frame) {
                                if (frame.isMissed) {
                                    checkTaskUpdates.frameErrors.push(frame.id);
                                }
                                frame.annotations.forEach(function (annotation) {
                                    if (annotation.invalid) {
                                        checkTaskUpdates.annotationErrors.push({
                                            frameId: frame.id,
                                            annotation: annotation
                                        });
                                    }
                                });
                            });
                        }
                        else {
                            annotationTaskUpdates = { state: "done" };
                        }
                        annotationTaskUpdates["checkCount"] = currentAnnotationTask.checkCount + 1;
                        errorInfo = "";
                        if (checkTaskUpdates.frameErrors.length > 0) {
                            errorInfo += "标注缺失";
                            if (checkTaskUpdates.annotationErrors.length > 0) {
                                errorInfo += ",";
                            }
                        }
                        if (checkTaskUpdates.annotationErrors.length > 0) {
                            errorInfo += "标注错误";
                        }
                        annotationTaskUpdates["errorInfo"] = errorInfo;
                        updateAnnotationTaskOption = {
                            "id": ctx.body.annotatingTaskId,
                            "updates": annotationTaskUpdates
                        };
                        return [4 /*yield*/, this.updateCurrentAnnotationTask(ctx, updateAnnotationTaskOption)];
                    case 4:
                        _a.sent();
                        updateCheckTaskOption = {
                            id: ctx.params.id,
                            updates: checkTaskUpdates
                        };
                        return [4 /*yield*/, this.updateCheckingTask(ctx, updateCheckTaskOption)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //检测frames是否都复查过
    CheckingTaskAPIService.prototype.findFrameUncheckedTasks = function (ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.services.FrameTaskService.findFrameTasks({
                taskId: ctx.body.annotatingTaskId,
                states: ["annotated", "checking"]
            }, function (err, result) {
                if (err) {
                    console.log(err);
                    ctx.done(new errors_1.Errors.UnknownError("Faild to find annotated or checking annotatingTask", { via: err }), null);
                    return;
                }
                if (result.length > 0) {
                    console.log(">>>>00000");
                    ctx.done(null, null);
                    return;
                }
                resolve();
            });
        });
    };
    //根据frames复查结果判断state为hasError或者done
    CheckingTaskAPIService.prototype.findFrameHasErrorTasks = function (ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.services.FrameTaskService.findFrameTasks({
                taskId: ctx.body.annotatingTaskId,
                states: ["hasError"]
            }, function (err, result) {
                if (err) {
                    ctx.done(new errors_1.Errors.UnknownError("Faild to find hasError annotatingTask", { via: err }), null);
                    return;
                }
                resolve(result);
            });
        });
    };
    //查询当前annotationTask,获得其复查次数
    CheckingTaskAPIService.prototype.getCurrentAnnotationTask = function (ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.services.AnnotatingTaskService.getAnnotatingTaskById({ id: ctx.body.annotatingTaskId }, function (err, result) {
                if (err) {
                    console.log(err);
                    ctx.done(new errors_1.Errors.UnknownError("Faild to get annotatingTask", { via: err }), null);
                    return;
                }
                resolve(result);
            });
        });
    };
    //更新annotationTask状态及复查次数
    CheckingTaskAPIService.prototype.updateCurrentAnnotationTask = function (ctx, option) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.services.AnnotatingTaskService.updateAnnotatingTaskById(option, function (err, result) {
                console.log("*-*");
                console.log(option);
                if (err) {
                    console.log(err);
                    ctx.done(new errors_1.Errors.UnknownError("Faild to  update annotatingTask", { via: err }), null);
                    return;
                }
                console.log(result);
                resolve(result);
            });
        });
    };
    //更新checkingTask状态为checked及复查完成时间
    CheckingTaskAPIService.prototype.updateCheckingTask = function (ctx, option) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.services.CheckingTaskService.updateCheckingTaskById(option, function (err, result) {
                if (err) {
                    console.log(err);
                    ctx.done(new errors_1.Errors.UnknownError("Faild to create update checkingTask", { via: err }), null);
                    return;
                }
                ctx.done(err, result);
                resolve();
            });
        });
    };
    return CheckingTaskAPIService;
}(RouteSpec.CheckingTaskAPIServiceSpec));
exports.CheckingTaskAPIService = CheckingTaskAPIService;
//# sourceMappingURL=api.checkingTask.js.map