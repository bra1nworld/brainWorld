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
var AnnotationTypeList = /** @class */ (function (_super) {
    __extends(AnnotationTypeList, _super);
    function AnnotationTypeList(lists) {
        var _this = _super.call(this) || this;
        lists.forEach(function (list) {
            var item = new AnnotationTypeListItem(list);
            item.node.onclick = function () {
                _this.events.emit("click", item.value);
            };
            _this.createList.push(item);
        });
        return _this;
    }
    return AnnotationTypeList;
}(R.AnnotationScene.AnnotationTypeList));
exports.AnnotationTypeList = AnnotationTypeList;
var AnnotationTypeListItem = /** @class */ (function (_super) {
    __extends(AnnotationTypeListItem, _super);
    function AnnotationTypeListItem(option) {
        var _this = _super.call(this) || this;
        _this.value = option.value;
        _this.VM.displayText = option.displayText;
        return _this;
    }
    AnnotationTypeListItem.prototype.onClickNode = function () {
        this.events.emit("click");
    };
    return AnnotationTypeListItem;
}(R.AnnotationScene.AnnotationTypeList.CreateListItem));
exports.AnnotationTypeListItem = AnnotationTypeListItem;
