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
var errors_1 = require("../errors");
var dbPaginateQuery_1 = require("../util/dbPaginateQuery");
var AnnotatingTaskService = /** @class */ (function (_super) {
    __extends(AnnotatingTaskService, _super);
    function AnnotatingTaskService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "AnnotatingTaskService";
        _this.dependencies = ["MongodbService",];
        return _this;
    }
    AnnotatingTaskService.prototype.initialize = function (done) {
        this.annotatingTaskCollection = this.services.MongodbService.db.collection("annotatingTask");
        this.annotatingTaskPaginator = new dbPaginateQuery_1.DbPaginateQuery(this.annotatingTaskCollection);
        this.annotatingTaskCollection.createIndex({ id: 1 }, { unique: true });
        done();
    };
    AnnotatingTaskService.prototype.queryAnnotatingTasks = function (option, callback) {
        var pageSize = option.pageSize, pageIndex = option.pageIndex;
        var query = {};
        if (option.videoId) {
            query["videoId"] = option.videoId;
        }
        if (option.workerId) {
            query["workerId"] = option.workerId;
        }
        if (option.state) {
            query["state"] = { $in: option.state };
        }
        this.annotatingTaskPaginator.query({
            pageSize: pageSize,
            pageIndex: pageIndex,
            query: query,
            sortBy: option.sortBy
        }, callback);
    };
    AnnotatingTaskService.prototype.findAnnotatingTasks = function (query, callback) {
        this.annotatingTaskCollection.find(query).toArray(function (err, result) {
            callback(err, result);
        });
    };
    AnnotatingTaskService.prototype.getAnnotatingTaskById = function (option, callback) {
        this.annotatingTaskCollection.findOne({ id: option.id }, function (err, annotatingTask) {
            if (err || !annotatingTask) {
                callback(new errors_1.Errors.NotFound());
                return;
            }
            callback(null, annotatingTask);
        });
    };
    AnnotatingTaskService.prototype.updateAnnotatingTaskById = function (option, callback) {
        var id = option.id, updates = option.updates;
        delete updates.id;
        delete updates["_id"];
        this.annotatingTaskCollection.findOneAndUpdate({ id: id }, { $set: updates }, function (err, result) {
            console.log("----------");
            console.log(result);
            callback(err, result && result.value);
        });
    };
    AnnotatingTaskService.prototype.applyAnnotatingTask = function (option, callback) {
        var _this = this;
        this.annotatingTaskCollection.find({ state: "pending" }).toArray(function (err, result) {
            if (err) {
                console.log(err);
                callback(err, true);
                return;
            }
            if (result.length < 1) {
                callback(null, false);
                return;
            }
            var pendingTask = result[0];
            _this.services.UserService.getUserById({ id: option.workerId }, function (err, user) {
                if (err) {
                    console.log(err);
                    callback(err, true);
                    return;
                }
                _this.annotatingTaskCollection.findOneAndUpdate({ id: pendingTask.id }, {
                    $set: {
                        state: "annotating",
                        workerId: option.workerId,
                        workerName: user.username
                    }
                }, function (err, updateResult) {
                    if (err) {
                        console.log("update failed" + err);
                        callback(err, true);
                        return;
                    }
                    callback(null, true);
                });
            });
        });
    };
    AnnotatingTaskService.prototype.createAnnotatingTasks = function (option, callback) {
        this.annotatingTaskCollection.insertMany(option, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            callback(null, true);
        });
    };
    AnnotatingTaskService.prototype.createTestData = function () {
        var annotatingTasks = [
            {
                id: "1",
                videoPath: "test1",
                startFrame: 15000,
                frameCount: 200,
                paddingSize: 5,
                checkCount: 0,
                state: "pending"
            }, {
                id: "2",
                videoPath: "test1",
                startFrame: 12000,
                frameCount: 200,
                paddingSize: 5,
                checkCount: 0,
                state: "pending"
            }, {
                id: "3",
                videoPath: "test1",
                startFrame: 13000,
                frameCount: 200,
                paddingSize: 5,
                workerId: "",
                checkCount: 0,
                state: "pending"
            }, {
                id: "4",
                videoPath: "test1",
                startFrame: 14000,
                frameCount: 200,
                paddingSize: 5,
                workerId: "",
                checkCount: 0,
                state: "pending"
            }, {
                id: "5",
                videoPath: "test1",
                startFrame: 15000,
                frameCount: 200,
                paddingSize: 5,
                workerId: "",
                checkCount: 0,
                state: "pending"
            }, {
                id: "6",
                videoPath: "test1",
                startFrame: 16000,
                frameCount: 200,
                paddingSize: 5,
                workerId: "",
                checkCount: 0,
                state: "pending"
            }, {
                id: "7",
                videoPath: "test1",
                startFrame: 17000,
                frameCount: 200,
                paddingSize: 5,
                checkCount: 0,
                workerId: "",
                state: "pending"
            }
        ];
        this.annotatingTaskCollection.insertMany(annotatingTasks, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });
    };
    return AnnotatingTaskService;
}(ServiceSpec.Service));
exports.AnnotatingTaskService = AnnotatingTaskService;
//# sourceMappingURL=annotatingTaskService.js.map