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
var FrameService = /** @class */ (function (_super) {
    __extends(FrameService, _super);
    function FrameService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "FrameService";
        _this.dependencies = ["MongodbService",];
        return _this;
    }
    FrameService.prototype.initialize = function (done) {
        this.frameCollection = this.services.MongodbService.db.collection("frame");
        this.framePaginator = new dbPaginateQuery_1.DbPaginateQuery(this.frameCollection);
        this.frameCollection.createIndex({ id: 1 }, { unique: true });
        done();
    };
    FrameService.prototype.queryFrames = function (option, callback) {
        var pageSize = option.pageSize, pageIndex = option.pageIndex;
        var query = {};
        if (option.state) {
            query["state"] = { $in: option.state };
        }
        this.createTestData();
        // this.framePaginator.query({
        //     pageSize,
        //     pageIndex,
        //     query: query,
        //     sortBy: option.sortBy
        // }, callback)
    };
    FrameService.prototype.proceedFrame = function (option, callback) {
    };
    FrameService.prototype.getFrameById = function (option, callback) {
        this.frameCollection.findOne({ id: option.frameId }, function (err, frame) {
            if (err || !frame) {
                callback(new errors_1.Errors.NotFound());
                return;
            }
            callback(null, frame);
        });
    };
    FrameService.prototype.updateFrame = function (option, callback) {
        var id = option.id, updates = option.updates;
        delete updates.id;
        delete updates["_id"];
        this.frameCollection.findOneAndUpdate({ id: id }, { $set: updates }, function (err, result) {
            callback(err, result && result.value);
        });
    };
    FrameService.prototype.createTestData = function () {
        //test
        var frames = [
            {
                id: "11",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14005,
                state: "pending"
            }, {
                id: "12",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14010,
                state: "annotating"
            }, {
                id: "13",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14015,
                state: "annotated"
            }, {
                id: "14",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14020,
                state: "checking"
            }, {
                id: "15",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14025,
                state: "hasError"
            }, {
                id: "16",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14030,
                state: "done"
            },
            {
                id: "21",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16005,
                state: "pending"
            }, {
                id: "22",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16010,
                state: "annotating"
            }, {
                id: "23",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16015,
                state: "annotated"
            }, {
                id: "24",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16020,
                state: "checking"
            }, {
                id: "25",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16025,
                state: "hasError"
            }, {
                id: "26",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16030,
                state: "done"
            }
        ];
        console.log("frame test data");
        this.frameCollection.insertMany(frames, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });
    };
    return FrameService;
}(ServiceSpec.Service));
exports.FrameService = FrameService;
//# sourceMappingURL=frameService.js.map