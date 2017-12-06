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
var helpers_1 = require("../../helpers");
var SillyTable = /** @class */ (function (_super) {
    __extends(SillyTable, _super);
    function SillyTable(definition, option) {
        if (option === void 0) { option = {}; }
        var _this = _super.call(this) || this;
        _this.definition = definition;
        _this.events = new Leaf.EventEmitter();
        _this.UI.thead.appendChild(new TableHead(_this).node);
        _this.VM.name = _this.definition.name;
        if (!_this.definition.actions || Object.keys(_this.definition.actions).length === 0) {
            _this.VM.withoutAction = true;
        }
        if (!option.checkbox) {
            _this.VM.withoutCheckbox = true;
        }
        if (option.focus) {
            _this.VM.withFocus = true;
            _this.focusBehavior = new SillyTableFocusBehavior(_this);
        }
        _this.events.listenBy(_this, "moveUp", function (data) {
            var all = _this.getAll();
            var result = all.map(function (item, index) {
                if (item === data) {
                    if (index > 0) {
                        return all[index - 1];
                    }
                }
                else if (all[index + 1] === data) {
                    return data;
                }
                return item;
            });
            _this.from(result);
        });
        _this.events.listenBy(_this, "moveDown", function (data) {
            var all = _this.getAll();
            var result = all.map(function (item, index) {
                if (item === data) {
                    if (all[index + 1]) {
                        return all[index + 1];
                    }
                }
                else if (all[index - 1] === data) {
                    return data;
                }
                return item;
            });
            console.log(result);
            _this.from(result);
        });
        return _this;
    }
    SillyTable.prototype.from = function (items) {
        if (this.focusBehavior)
            this.focusBehavior.currentFocus = null;
        this.rows.empty();
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            this.add(item);
        }
        if (this.focusBehavior && this.rows.length > 0) {
            this.focusBehavior.focusAt(this.rows[0]);
        }
    };
    SillyTable.prototype.add = function (item) {
        var _this = this;
        var row = new TableRow(this, item, this.rows.length);
        var index = this.rows.length - 1;
        this.rows.push(row);
        var _loop_1 = function (name_1) {
            row.events.listenBy(this_1, name_1, function (data) {
                _this.events.emit(name_1, row.data);
            });
        };
        var this_1 = this;
        for (var name_1 in this.definition.actions) {
            _loop_1(name_1);
        }
    };
    SillyTable.prototype.selectAll = function () {
        return this.rows.toArray().forEach(function (item) {
            item.select();
        });
    };
    SillyTable.prototype.unselectAll = function () {
        return this.rows.toArray().forEach(function (item) {
            item.unselect();
        });
    };
    SillyTable.prototype.getAll = function () {
        return this.rows.toArray().map(function (item) { return item.data; });
    };
    SillyTable.prototype.getSelected = function () {
        return null;
    };
    SillyTable.prototype.getFocus = function () {
        if (this.focusBehavior && this.focusBehavior.currentFocus) {
            return this.focusBehavior.currentFocus.data;
        }
        return null;
    };
    return SillyTable;
}(R.Base.SillyTable));
exports.SillyTable = SillyTable;
var TableHead = /** @class */ (function (_super) {
    __extends(TableHead, _super);
    function TableHead(table) {
        var _this = _super.call(this) || this;
        _this.table = table;
        _this.allSelect = false;
        for (var name_2 in _this.table.definition.fields) {
            if (name_2 === "_extra")
                continue;
            var displayText = _this.table.definition.fields[name_2];
            _this.addHeadItem(displayText, name_2);
        }
        if (table.definition.fields && table.definition.fields._extra) {
            for (var _i = 0, _a = table.definition.fields._extra; _i < _a.length; _i++) {
                var item = _a[_i];
                _this.addHeadItem(item.displayName);
            }
        }
        return _this;
    }
    TableHead.prototype.addHeadItem = function (displayText, name) {
        var th = document.createElement("th");
        th.className = "th " + helpers_1.camelToDash(name);
        th.innerHTML = displayText;
        this.node.insertBefore(th, this.UI.actions);
    };
    TableHead.prototype.onClickCheckbox = function () {
        if (!this.allSelect) {
            this.table.selectAll();
        }
        else {
            this.table.unselectAll();
        }
        this.allSelect = !this.allSelect;
    };
    return TableHead;
}(R.Base.SillyTable.Head));
exports.TableHead = TableHead;
var TableRow = /** @class */ (function (_super) {
    __extends(TableRow, _super);
    function TableRow(table, data, index) {
        var _this = _super.call(this) || this;
        _this.table = table;
        _this.data = data;
        _this.index = index;
        _this.events = new Leaf.EventEmitter();
        for (var name_3 in _this.table.definition.fields) {
            if (name_3 === "_extra")
                continue;
            var displayText = void 0;
            var trans = table.definition.transform || {};
            if (trans[name_3]) {
                displayText = trans[name_3](_this.data[name_3], _this.data, _this.index);
            }
            else {
                if (typeof _this.data[name_3] === "boolean") {
                    displayText = _this.data[name_3] && "是" || "否";
                }
                else {
                    displayText = _this.data[name_3];
                }
            }
            _this.addItem(displayText, name_3);
        }
        if (_this.table.definition.fields._extra) {
            for (var _i = 0, _a = _this.table.definition.fields._extra; _i < _a.length; _i++) {
                var item = _a[_i];
                var value = item.compute(_this.data);
                _this.addItem(value, name);
            }
        }
        var _loop_2 = function (action) {
            var displayText = this_2.table.definition.actions[action];
            if (typeof displayText === "function") {
                displayText = displayText(this_2.data);
            }
            if (!displayText)
                return "continue";
            var button = new R.Base.SillyTable.Row.ActionButton();
            button.node.innerHTML = displayText;
            button.node.title = displayText;
            button.node.classList.add(action);
            button.node.onclick = function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                _this.events.emit(action);
            };
            this_2.actions.push(button);
        };
        var this_2 = this;
        for (var action in _this.table.definition.actions) {
            _loop_2(action);
        }
        if (_this.table.definition.extraTokens && typeof _this.table.definition.extraTokens == "function") {
            _this.table.definition.extraTokens(_this.data).forEach(function (className) {
                _this.node.classList.add(helpers_1.camelToDash(className));
            });
        }
        return _this;
    }
    TableRow.prototype.addItem = function (displayText, name) {
        var th = document.createElement("td");
        th.className = "td " + helpers_1.camelToDash(name);
        if (displayText === 0)
            displayText = "0";
        th.innerHTML = displayText || "(空)";
        this.node.insertBefore(th, this.UI.actions);
    };
    TableRow.prototype.select = function () {
        this.UI.checkbox.checked = true;
    };
    TableRow.prototype.unselect = function () {
        this.UI.checkbox.checked = false;
    };
    TableRow.prototype.onClick = function (e) {
        if (this.table.focusBehavior) {
            this.table.focusBehavior.focusAt(this);
        }
    };
    return TableRow;
}(R.Base.SillyTable.Row));
exports.TableRow = TableRow;
var SillyTableFocusBehavior = /** @class */ (function () {
    function SillyTableFocusBehavior(table) {
        this.table = table;
        //this.table.rows.events.listenBy(this, "child/add", (child: TableRow<TModel, TAction>) => {
        //    console.log("attach click", child)
        //    child.node.onclick = (e) => {
        //        console.log("click", "???")
        //        e.stopImmediatePropagation()
        //        e.preventDefault()
        //        this.focusAt(child)
        //    }
        //})
    }
    SillyTableFocusBehavior.prototype.focusAt = function (node) {
        if (this.currentFocus) {
            this.currentFocus.VM.focus = false;
        }
        this.currentFocus = node;
        this.currentFocus.VM.focus = true;
    };
    return SillyTableFocusBehavior;
}());
exports.SillyTableFocusBehavior = SillyTableFocusBehavior;
