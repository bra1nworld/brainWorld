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
var FrameTaskService = /** @class */ (function (_super) {
    __extends(FrameTaskService, _super);
    function FrameTaskService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "FrameTaskService";
        _this.dependencies = ["MongodbService",];
        return _this;
    }
    FrameTaskService.prototype.initialize = function (done) {
        this.frameTaskCollection = this.services.MongodbService.db.collection("frameTask");
        this.frameTaskPaginator = new dbPaginateQuery_1.DbPaginateQuery(this.frameTaskCollection);
        this.frameTaskCollection.createIndex({ id: 1 }, { unique: true });
        done();
    };
    FrameTaskService.prototype.queryFrames = function (option, callback) {
        var pageSize = option.pageSize, pageIndex = option.pageIndex;
        var query = {
            taskId: option.taskId
        };
        if (option.state) {
            query["state"] = { $in: option.state };
        }
        this.frameTaskPaginator.query({
            pageSize: pageSize,
            pageIndex: pageIndex,
            query: query,
            sortBy: option.sortBy
        }, callback);
    };
    FrameTaskService.prototype.findFrameTasks = function (query, callback) {
        var option = query;
        if (query.states) {
            option["state"] = { $in: query.states };
        }
        delete option.states;
        this.frameTaskCollection.find(option).toArray(function (err, result) {
            callback(err, result);
        });
    };
    FrameTaskService.prototype.getFrameById = function (option, callback) {
        this.frameTaskCollection.findOne({ id: option.id }, function (err, frame) {
            if (err || !frame) {
                callback(new errors_1.Errors.NotFound());
                return;
            }
            callback(null, frame);
        });
    };
    FrameTaskService.prototype.updateFrame = function (option, callback) {
        var id = option.id, updates = option.updates;
        delete updates.id;
        delete updates["_id"];
        this.frameTaskCollection.findOneAndUpdate({ id: id }, { $set: updates }, function (err, result) {
            callback(err, result && result.value);
        });
    };
    FrameTaskService.prototype.createFrameTasks = function (option, callback) {
        this.frameTaskCollection.insertMany(option, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            callback(null, true);
        });
    };
    FrameTaskService.prototype.createTestData = function () {
        //test
        var frames = [
            {
                id: "11",
                videoPath: "test1",
                taskId: "1",
                frameIndex: 11005,
                state: "pending"
            }, {
                id: "12",
                videoPath: "test1",
                taskId: "1",
                frameIndex: 11010,
                state: "pending"
            }, {
                id: "13",
                videoPath: "test1",
                taskId: "1",
                frameIndex: 11015,
                state: "pending"
            },
            {
                id: "21",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12005,
                state: "pending"
            }, {
                id: "22",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12010,
                state: "pending"
            }, {
                id: "23",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12015,
                state: "pending"
            }, {
                id: "24",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12020,
                state: "pending"
            }, {
                id: "25",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12025,
                state: "pending"
            }, {
                id: "26",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12030,
                state: "pending"
            },
            {
                id: "31",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13005,
                state: "pending"
            }, {
                id: "32",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13010,
                state: "pending"
            }, {
                id: "33",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13015,
                state: "pending"
            }, {
                id: "34",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13020,
                state: "pending"
            }, {
                id: "35",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13025,
                state: "pending"
            }, {
                id: "36",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13030,
                state: "pending"
            },
            {
                id: "41",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14005,
                state: "pending"
            }, {
                id: "42",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14010,
                state: "pending"
            }, {
                id: "43",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14015,
                state: "pending"
            }, {
                id: "44",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14020,
                state: "pending"
            }, {
                id: "45",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14025,
                state: "pending"
            }, {
                id: "46",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14030,
                state: "pending"
            },
            {
                id: "51",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15005,
                state: "pending"
            }, {
                id: "52",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15010,
                state: "pending"
            }, {
                id: "53",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15015,
                state: "pending"
            }, {
                id: "54",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15020,
                state: "pending"
            }, {
                id: "55",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15025,
                state: "pending"
            }, {
                id: "56",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15030,
                state: "pending"
            },
            {
                id: "61",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16005,
                state: "pending"
            }, {
                id: "62",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16010,
                state: "pending"
            }, {
                id: "63",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16015,
                state: "pending"
            }, {
                id: "64",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16020,
                state: "pending"
            }, {
                id: "65",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16025,
                state: "pending"
            }, {
                id: "66",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16030,
                state: "pending"
            },
            {
                id: "71",
                videoPath: "test1",
                taskId: "7",
                frameIndex: 17005,
                state: "pending"
            }, {
                id: "72",
                videoPath: "test1",
                taskId: "7",
                frameIndex: 17010,
                state: "pending"
            }, {
                id: "73",
                videoPath: "test1",
                taskId: "7",
                frameIndex: 17015,
                state: "pending"
            }
        ];
        console.log("frame test data");
        this.frameTaskCollection.insertMany(frames, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });
    };
    return FrameTaskService;
}(ServiceSpec.Service));
exports.FrameTaskService = FrameTaskService;
//# sourceMappingURL=frameTaskService.js.map