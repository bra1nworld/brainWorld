"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContinuousCounter = /** @class */ (function () {
    function ContinuousCounter(option) {
        if (option === void 0) { option = {}; }
        this.events = new Leaf.EventEmitter();
        this.actions = [];
        this.count = option.count || 10;
        if (this.count <= 2)
            this.count = 2;
        this.during = option.during || 3000;
    }
    ContinuousCounter.prototype.trigger = function () {
        var _this = this;
        this.actions.push({
            time: new Date
        });
        if (this.actions.length >= this.count) {
            this.actions.length = 0;
            this.events.emit("trigger");
        }
        var step = this.during / this.count;
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            _this.actions.length = 0;
        }, step);
    };
    return ContinuousCounter;
}());
exports.ContinuousCounter = ContinuousCounter;
