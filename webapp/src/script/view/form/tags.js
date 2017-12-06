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
var Tags = /** @class */ (function (_super) {
    __extends(Tags, _super);
    function Tags(option) {
        var _this = _super.call(this) || this;
        _this.tags = [];
        _this.name = option.name;
        _this.displayName = option.displayName;
        _this.VM.displayName = option.displayName;
        return _this;
    }
    Tags.prototype.onChildAddTagList = function (child) {
        var _this = this;
        child.events.listenBy(this, "remove", function () {
            _this.tagList.removeItem(child);
        });
    };
    Tags.prototype.onChildRemoveTagList = function (child) {
        child.events.stopListenBy(this);
    };
    Tags.prototype.onKeyupInput = function (e) {
        var splitterCode = [
            Leaf.Key.enter, Leaf.Key.comma, Leaf.Key.space
        ];
        if (splitterCode.indexOf(e.which) >= 0) {
            var value = this.UI.input.value.trim();
            for (var _i = 0, _a = this.tagList.toArray(); _i < _a.length; _i++) {
                var tag = _a[_i];
                if (tag.name === value)
                    return;
            }
            this.applyInput();
            return;
        }
    };
    Tags.prototype.onKeydownInput = function (e) {
        if (e.which === Leaf.Key.backspace && !this.UI.input.value) {
            this.tagList.pop();
        }
    };
    Tags.prototype.applyInput = function () {
        var value = this.UI.input.value.trim();
        this.tagList.push(new Tag(value));
        this.UI.input.value = "";
    };
    Tags.prototype.getValue = function () {
        return this.tagList.map(function (item) { return item.name; });
    };
    Tags.prototype.setValue = function (tags) {
        this.tagList.length = 0;
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            this.tagList.push(new Tag(tag));
        }
    };
    return Tags;
}(R.Form.Tags));
exports.Tags = Tags;
var Tag = /** @class */ (function (_super) {
    __extends(Tag, _super);
    function Tag(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.events = new Leaf.EventEmitter();
        _this.VM.name = name;
        return _this;
    }
    Tag.prototype.onClickNode = function () {
        this.events.emit("remove", this);
    };
    return Tag;
}(R.Form.Tags.TagListItem));
