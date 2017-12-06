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
var app_1 = require("../app");
var isFirst = false;
var SiteSider = /** @class */ (function (_super) {
    __extends(SiteSider, _super);
    function SiteSider(privilege) {
        var _this = _super.call(this) || this;
        if (!privilege) {
            _this.privilege = {
                pendingTask: true,
                annotatingTask: true,
                checkAnnotatedTask: true,
                doneTask: true,
                myAnnotatingTask: true,
                myAnnotatedTask: true,
                myCheckingTask: true,
                myCheckedTask: true,
                userManagement: true
            };
        }
        else {
            _this.privilege = privilege;
        }
        var _loop_1 = function (data) {
            var exit = false;
            data.children.forEach(function (child) {
                if (_this.privilege[child.name]) {
                    exit = true;
                }
            });
            if (!exit)
                return "continue";
            var entry = new Entry(this_1.privilege, data);
            entry.events.listenBy(this_1, "expanding", function () {
                _this.entryList.forEach(function (item) {
                    item.unexpand();
                });
            });
            this_1.entryList.push(entry);
        };
        var this_1 = this;
        for (var _i = 0, SiteMap_1 = SiteMap; _i < SiteMap_1.length; _i++) {
            var data = SiteMap_1[_i];
            _loop_1(data);
        }
        return _this;
    }
    return SiteSider;
}(R.SiteSider));
exports.SiteSider = SiteSider;
var Entry = /** @class */ (function (_super) {
    __extends(Entry, _super);
    function Entry(privilege, data) {
        var _this = _super.call(this) || this;
        _this.privilege = privilege;
        _this.data = data;
        _this.events = new Leaf.EventEmitter();
        _this.VM.name = _this.data.displayText;
        app_1.App.events.listenBy(_this, "initialized", function () {
            for (var _i = 0, _a = data.children; _i < _a.length; _i++) {
                var child = _a[_i];
                _this.addChild(child);
            }
        });
        return _this;
    }
    Entry.prototype.addChild = function (data) {
        var _this = this;
        var subEntry = new SubEntry(this.privilege, data);
        if (!data.persisted) {
            if (!this.privilege[data.name]) {
                return;
            }
        }
        if (!isFirst) {
            isFirst = true;
            data.selected = true;
        }
        if (data.selected) {
            subEntry.select();
            this.expand();
        }
        this.subEntryList.push(subEntry);
        subEntry.events.listenBy(this, "selecting", function () {
            _this.unselectChilds();
        });
        if (subEntry.VM.available) {
            this.VM.available = true;
        }
    };
    Entry.prototype.unselectChilds = function () {
        this.subEntryList.forEach(function (item) {
            item.unselect();
        });
    };
    Entry.prototype.expand = function () {
        this.events.emit("expanding");
        this.unselectChilds();
        this.VM.expanded = true;
        this.events.emit("expanded");
    };
    Entry.prototype.unexpand = function () {
        this.VM.expanded = false;
        this.events.emit("unexpanded");
    };
    Entry.prototype.onClickExpand = function () {
        this.expand();
    };
    return Entry;
}(R.SiteSider.EntryListItem));
exports.Entry = Entry;
var SubEntry = /** @class */ (function (_super) {
    __extends(SubEntry, _super);
    function SubEntry(privilege, data) {
        var _this = _super.call(this) || this;
        _this.privilege = privilege;
        _this.data = data;
        _this.events = new Leaf.EventEmitter();
        _this.VM.name = _this.data.displayText;
        _this.VM.available = _this.privilege[_this.data.name];
        return _this;
    }
    SubEntry.prototype.select = function () {
        this.events.emit("selecting");
        app_1.App.openEntry(this.data.name);
        this.VM.selected = true;
        this.events.emit("selected");
    };
    SubEntry.prototype.unselect = function () {
        this.VM.selected = false;
        this.events.emit("unselected");
    };
    SubEntry.prototype.onClickNode = function () {
        this.select();
    };
    return SubEntry;
}(R.SiteSider.EntryListItem.SubEntryListItem));
exports.SubEntry = SubEntry;
var SiteMap = [
    {
        displayText: "标注任务",
        children: [{
                name: "pendingTask",
                displayText: "未分配",
            }, {
                name: "annotatingTask",
                displayText: "标注阶段",
            }, {
                name: "checkAnnotatedTask",
                displayText: "复查阶段",
            }, {
                name: "doneTask",
                displayText: "已完成",
            }, {
                name: "myAnnotatingTask",
                displayText: "我的待标注任务",
            }, {
                name: "myAnnotatedTask",
                displayText: "我的已标注任务",
            }]
    },
    {
        displayText: "复查任务",
        children: [{
                name: "myCheckingTask",
                displayText: "我的待复查任务",
            }, {
                name: "myCheckedTask",
                displayText: "我的已复查任务",
            },]
    },
    {
        displayText: "系统管理",
        children: [{
                name: "userManagement",
                displayText: "用户管理",
            }]
    }
];
