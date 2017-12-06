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
var CheckingTaskService = /** @class */ (function (_super) {
    __extends(CheckingTaskService, _super);
    function CheckingTaskService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "CheckingTaskService";
        _this.dependencies = ["MongodbService", "IncrementalIdService"];
        return _this;
    }
    CheckingTaskService.prototype.initialize = function (done) {
        this.CheckingTaskCollection = this.services.MongodbService.db.collection("checkingTask");
        this.CheckingTaskPaginator = new dbPaginateQuery_1.DbPaginateQuery(this.CheckingTaskCollection);
        this.CheckingTaskCollection.createIndex({ id: 1 }, { unique: true });
        this.services.IncrementalIdService.ensure({ name: "checkingTask", offset: 1000 }, function () {
        });
        done();
    };
    CheckingTaskService.prototype.queryCheckingTasks = function (option, callback) {
        var pageSize = option.pageSize, pageIndex = option.pageIndex;
        var query = {};
        if (option.checkerId) {
            query["checkerId"] = option.checkerId;
        }
        if (option.state) {
            query["state"] = option.state;
        }
        this.CheckingTaskPaginator.query({
            pageSize: pageSize,
            pageIndex: pageIndex,
            query: query,
            sortBy: option.sortBy
        }, callback);
    };
    CheckingTaskService.prototype.createCheckingTask = function (option, callback) {
        var _this = this;
        this.services.IncrementalIdService.next({ name: "checkingTask" }, function (err, id) {
            if (err) {
                callback(err);
                return;
            }
            option["id"] = id.toString();
            option["startTime"] = new Date();
            option["state"] = "checking";
            _this.CheckingTaskCollection.insertOne(option, function (err) {
                if (err) {
                    callback(new errors_1.Errors.UnknownError("Faild to create checkingTask", { via: err }));
                    return;
                }
                callback(null, option);
            });
        });
    };
    CheckingTaskService.prototype.getCheckingTaskById = function (option, callback) {
        this.CheckingTaskCollection.findOne({ id: option.id }, function (err, checkingTask) {
            if (err || !checkingTask) {
                callback(new errors_1.Errors.NotFound());
                return;
            }
            callback(null, checkingTask);
        });
    };
    CheckingTaskService.prototype.updateCheckingTaskById = function (option, callback) {
        var id = option.id, updates = option.updates;
        delete updates.id;
        delete updates["_id"];
        this.CheckingTaskCollection.findOneAndUpdate({ id: id }, { $set: updates }, function (err, result) {
            callback(err, result && result.value);
        });
    };
    CheckingTaskService.prototype.applyCheckingTask = function (option, callback) {
        //test
        /**
         * annotatingTaskId: "标注任务编号",
                    startTime: "开始时间",
                    endTime: "结束时间",
                    checkerId: "复查人",
                    state: "复查状态",
         */
        var checkingTasks = [
            {
                id: "101",
                annotatingTaskId: "5",
                startTime: "",
                endTime: "",
                checkerId: "321",
                state: "checking"
            }, {
                id: "102",
                annotatingTaskId: "7",
                startTime: "",
                endTime: "",
                checkerId: "321",
                state: "checked"
            }, {
                id: "103",
                annotatingTaskId: "6",
                startTime: "",
                endTime: "",
                checkerId: "321",
                state: "checked"
            }
        ];
        console.log(5465135465);
        this.CheckingTaskCollection.insertMany(checkingTasks, function (err, result) {
            if (err) {
                console.log(err);
                callback(err, false);
                return;
            }
            callback(null, true);
        });
        // callback(null, true)
    };
    return CheckingTaskService;
}(ServiceSpec.Service));
exports.CheckingTaskService = CheckingTaskService;
//# sourceMappingURL=checkingTaskService.js.map