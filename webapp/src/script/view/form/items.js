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
var Items = /** @class */ (function (_super) {
    __extends(Items, _super);
    function Items(option) {
        var _this = _super.call(this) || this;
        _this.nameField = "name";
        _this.editor = null;
        _this.name = option.name;
        _this.displayName = option.displayName;
        _this.VM.displayName = option.displayName;
        return _this;
    }
    Items.prototype.onChildAddItemList = function (child) {
        var _this = this;
        child.events.listenBy(this, "remove", function () {
            _this.itemList.removeItem(child);
        });
    };
    Items.prototype.onChildRemoveItemList = function (child) {
        child.events.stopListenBy(this);
    };
    Items.prototype.onClickAdd = function () {
        var _this = this;
        var editor = new this.editor;
        editor.edit({}, function (err, result) {
            if (result) {
                _this.itemList.push(new Item(result, _this));
            }
        });
    };
    Items.prototype.getValue = function () {
        return this.itemList.map(function (item) { return item.data; });
    };
    Items.prototype.setValue = function (items) {
        this.itemList.length = 0;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            this.itemList.push(new Item(item, this));
        }
    };
    Items.prototype.setMeta = function (meta) {
        this.editor = meta.editor;
        if (meta.nameField)
            this.nameField = meta.nameField;
    };
    return Items;
}(R.Form.Items));
exports.Items = Items;
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(data, parent) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.parent = parent;
        _this.events = new Leaf.EventEmitter();
        _this.VM.name = data[_this.parent.nameField];
        return _this;
    }
    Item.prototype.onClickNode = function () {
        var _this = this;
        var editor = new this.parent.editor;
        editor.edit(this.data, function (err, result) {
            if (result) {
                _this.data = result;
                _this.VM.name = result[_this.parent.nameField];
            }
        });
    };
    Item.prototype.onClickDelete = function (e) {
        e.capture();
        this.events.emit("remove", this);
    };
    return Item;
}(R.Form.Items.ItemListItem));
