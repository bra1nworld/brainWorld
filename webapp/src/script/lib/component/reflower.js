"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListReflower = /** @class */ (function () {
    function ListReflower() {
    }
    ListReflower.reflow = function (list, itemHeight) {
        var _this = this;
        list.forEach(function (item, index) {
            _this.transform(item, index * itemHeight);
        });
    };
    ListReflower.transform = function (item, top) {
        item.node.style.top = top + "px";
    };
    return ListReflower;
}());
exports.ListReflower = ListReflower;
