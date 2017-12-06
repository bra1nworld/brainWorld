"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IntervaledQueue = /** @class */ (function () {
    function IntervaledQueue(interval) {
        this.interval = interval;
        this.events = new Leaf.EventEmitter();
        this.taskQueue = [];
    }
    IntervaledQueue.prototype.push = function (task) {
        var _this = this;
        if (this.taskQueue.length === 0 && (!this.previousTaskDate || Date.now() - this.previousTaskDate > this.interval)) {
            this.previousTaskDate = Date.now();
            this.handle(task);
        }
        else {
            this.taskQueue.push(task);
            clearTimeout(this.solveTaskTimer);
            this.solveTaskTimer = setTimeout(function () {
                _this.solveTask();
            }, this.interval - (Date.now() - this.previousTaskDate));
        }
    };
    IntervaledQueue.prototype.solveTask = function () {
        var _this = this;
        var task = this.taskQueue.shift();
        if (!task)
            return;
        this.previousTaskDate = Date.now();
        this.handle(task);
        if (this.taskQueue.length != 0) {
            this.solveTaskTimer = setTimeout(function () {
                _this.solveTask();
            }, this.interval);
        }
    };
    IntervaledQueue.prototype.handle = function (task) {
        this.events.emit("solve", task);
    };
    return IntervaledQueue;
}());
exports.IntervaledQueue = IntervaledQueue;
