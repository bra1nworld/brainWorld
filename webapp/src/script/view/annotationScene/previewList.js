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
var PreviewList = /** @class */ (function (_super) {
    __extends(PreviewList, _super);
    function PreviewList(anntationFrameIndex, frameCount) {
        var _this = _super.call(this) || this;
        _this.anntationFrameIndex = anntationFrameIndex;
        _this.frameCount = frameCount;
        _this.previewListCount = 9;
        _this.render(anntationFrameIndex, frameCount);
        return _this;
    }
    PreviewList.prototype.render = function (frameIndex, frameCount) {
        var _this = this;
        if (this.previewList.length > 0)
            this.previewList.empty();
        this.activeIndex = frameIndex;
        var frameArray = [];
        frameArray.push(this.anntationFrameIndex.toString());
        for (var i = 0; i < 9; i++) {
            var index = frameIndex - (this.previewListCount - 1) / 2 + i;
            if (index >= 0 && index <= frameCount - 1) {
                frameArray.push(index);
            }
            else {
                frameArray.push("");
            }
        }
        frameArray.push(this.anntationFrameIndex.toString());
        frameArray.forEach(function (index) {
            var item = new PreviewListItem(index);
            _this.previewList.push(item);
            item.node.onclick = function () {
                var preFrameIndex;
                _this.previewList.forEach(function (previewItem) {
                    if (previewItem.isActived) {
                        preFrameIndex = previewItem.index;
                        previewItem.unActive();
                    }
                    previewItem.unActiveCurrentIndex();
                });
                item.active();
                _this.render(item.index, frameCount);
                _this.events.emit("click", item.index);
            };
        });
        //active
        this.previewList[frameArray.indexOf(frameIndex)].active();
        //activeCurrentIndex
        if (frameArray.indexOf(this.anntationFrameIndex) > -1) {
            this.previewList[frameArray.indexOf(this.anntationFrameIndex)].activeCurrentIndex();
        }
        else {
            if (frameIndex > this.anntationFrameIndex) {
                this.previewList[0].activeCurrentIndex();
            }
            else {
                this.previewList[this.previewList.length - 1].activeCurrentIndex();
            }
        }
    };
    PreviewList.prototype.onClickNextPage = function () {
        if (this.activeIndex == this.frameCount - 1) {
            return;
        }
        this.render(this.activeIndex + 1, this.frameCount);
        //this.activeIndex has changed
        this.events.emit("click", this.activeIndex);
    };
    PreviewList.prototype.onClickPrePage = function () {
        if (this.activeIndex == 0) {
            return;
        }
        this.render(this.activeIndex - 1, this.frameCount);
        //this.activeIndex has changed
        this.events.emit("click", this.activeIndex);
    };
    return PreviewList;
}(R.AnnotationScene.PreviewList));
exports.PreviewList = PreviewList;
var PreviewListItem = /** @class */ (function (_super) {
    __extends(PreviewListItem, _super);
    function PreviewListItem(index) {
        var _this = _super.call(this) || this;
        if (typeof (index) !== "string") {
            _this.index = index;
            _this.VM.frameIndex = index.toString();
        }
        else {
            _this.index = Number(index);
            _this.VM.frameIndex = "";
        }
        return _this;
    }
    PreviewListItem.prototype.onClickNode = function () {
        this.events.emit("click");
    };
    PreviewListItem.prototype.active = function () {
        this.VM.active = true;
        this.isActived = true;
    };
    PreviewListItem.prototype.unActive = function () {
        this.VM.active = false;
        this.isActived = false;
    };
    PreviewListItem.prototype.activeCurrentIndex = function () {
        this.VM.currentIndexNumber = true;
    };
    PreviewListItem.prototype.unActiveCurrentIndex = function () {
        this.VM.currentIndexNumber = false;
    };
    return PreviewListItem;
}(R.AnnotationScene.PreviewList.PreviewListItem));
exports.PreviewListItem = PreviewListItem;
