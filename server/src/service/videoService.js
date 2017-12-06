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
var dbPaginateQuery_1 = require("../util/dbPaginateQuery");
var VideoService = /** @class */ (function (_super) {
    __extends(VideoService, _super);
    function VideoService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.taskFramesCount = 100;
        _this.name = "VideoService";
        _this.dependencies = ["MongodbService", "AnnotatingTaskService", "FrameTaskService"];
        return _this;
    }
    VideoService.prototype.initialize = function (done) {
        this.videoCollection = this.services.MongodbService.db.collection("video");
        this.videoPaginator = new dbPaginateQuery_1.DbPaginateQuery(this.videoCollection);
        this.videoCollection.createIndex({ id: 1 }, { unique: true });
        done();
    };
    VideoService.prototype.getVideos = function (option, callback) {
    };
    VideoService.prototype.createTask = function (option, callback) {
        var _this = this;
        console.log("paddingSize-------------------" + option.paddingSize);
        this.paddingSize = option.paddingSize ? option.paddingSize : 5;
        var taskPaddingFramesCount = this.taskFramesCount * this.paddingSize;
        var filePath = option.filePath, frameTotalCount = option.frameTotalCount;
        var remainder = frameTotalCount % taskPaddingFramesCount;
        var tasksCount = Math.ceil(frameTotalCount / taskPaddingFramesCount);
        //任务,id为Date.now()+四位数index  17位
        var annotatingTasks = [], frameTasks = [], nowDate = formatDateTime(new Date());
        for (var i = 1; i <= tasksCount; i++) {
            //12+4
            var taskId = nowDate + (i + 10000).toString().substr(1, 4);
            var startFrame = taskPaddingFramesCount * (i - 1); // start from 0
            var frameCount = this.taskFramesCount;
            if (i == tasksCount) {
                if (remainder != 0) {
                    frameCount = Math.ceil(remainder / this.paddingSize);
                }
            }
            annotatingTasks.push({
                id: taskId,
                videoPath: filePath,
                startFrame: startFrame,
                frameCount: frameCount,
                paddingSize: this.paddingSize,
                checkCount: 0,
                state: "pending"
            });
            for (var j = 1; j <= frameCount; j++) {
                //frameId 12+7
                var frameIndex = startFrame + (j - 1) * this.paddingSize;
                var frameId = nowDate + (frameIndex + 10000000).toString().substr(1, 7);
                frameTasks.push({
                    id: frameId,
                    videoPath: filePath,
                    taskId: taskId,
                    frameIndex: frameIndex,
                    state: "pending"
                });
            }
        }
        this.services.AnnotatingTaskService.createAnnotatingTasks(annotatingTasks, function (err, annotatingTaskResult) {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }
            _this.services.FrameTaskService.createFrameTasks(frameTasks, function (err, frameTaskResult) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                    return;
                }
                callback(null, true);
            });
        });
        function formatDateTime(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var mon = m < 10 ? ('0' + m) : m.toString();
            var d = date.getDate();
            var day = d < 10 ? ('0' + d) : d.toString();
            var h = date.getHours().toString();
            var minute = date.getMinutes();
            var min = minute < 10 ? ('0' + minute) : minute.toString();
            return y + mon + day + h + minute;
        }
    };
    return VideoService;
}(ServiceSpec.Service));
exports.VideoService = VideoService;
//# sourceMappingURL=videoService.js.map