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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var DataListEditor = /** @class */ (function (_super) {
    __extends(DataListEditor, _super);
    function DataListEditor(definition) {
        var _this = _super.call(this) || this;
        _this.definition = definition;
        _this.VM.title = definition.title;
        _this.VM.required = definition.required;
        _this.VM.addButton = definition.addButton;
        _this.VM.applyButton = definition.applyButton;
        _this.VM.backButton = definition.backButton;
        _this.VM.name = definition.name;
        _this.render(null);
        if (_this.definition.filter) {
            _this.renderFilter(_this.definition.filter);
        }
        if (_this.definition.pagination) {
            _this.renderPagination(_this.definition.pagination);
        }
        if (_this.definition.readonly) {
            _this.readonly(_this.definition.readonly);
        }
        return _this;
    }
    DataListEditor.prototype.readonly = function (readonly) {
        if (readonly === void 0) { readonly = true; }
        this.VM.readonly = readonly;
    };
    DataListEditor.prototype.refresh = function (option) {
        if (option === void 0) { option = {}; }
        this.events.emit("refresh");
    };
    DataListEditor.prototype.addItem = function (data) {
        var items = this.table.getAll();
        items.push(data);
        this.table.from(items);
    };
    DataListEditor.prototype.deleteItem = function (data) {
        if (window.confirm("确定删除？")) {
            this.table.from(this.table.getAll().filter(function (item) { return item != data; }));
        }
    };
    DataListEditor.prototype.editItem = function (oldData, newData) {
        var index;
        var items = this.table.getAll().filter(function (item, i) {
            if (item != oldData) {
                index = i;
                return true;
            }
            return false;
        });
        items.splice(index, 0, newData);
        this.table.from(items);
    };
    DataListEditor.prototype.render = function (items) {
        var _this = this;
        var definition = this.definition;
        var _a = definition.table, name = _a.name, fields = _a.fields, actions = _a.actions, transform = _a.transform, actionAvailable = _a.actionAvailable, extraTokens = _a.extraTokens;
        var downloadActions = {};
        var tableActions = {};
        if (definition.form) {
            var _b = definition.form, types = _b.types, formFields = _b.fields;
            var _loop_1 = function (k) {
                if (types[k] == "file") {
                    downloadActions["download-" + k] = {
                        displayText: "\u4E0B\u8F7D" + formFields[k],
                        handler: function (manager, data) {
                            var file = data[k];
                            if (file && typeof file == "string") {
                                helpers_1.downloadFile(file);
                            }
                        }
                    };
                }
            };
            for (var k in types) {
                _loop_1(k);
            }
        }
        var allActions = __assign({}, actions, downloadActions);
        for (var a in allActions) {
            var action = allActions[a];
            if (isCustomAction(action)) {
                tableActions[a] = action.displayText;
            }
            else {
                tableActions[a] = action;
            }
        }
        var table = new sillyTable_1.SillyTable({
            name: name,
            fields: fields,
            transform: transform,
            extraTokens: extraTokens,
            actions: tableActions
        });
        this.table = table;
        table.events.listenBy(this, "delete", function (data) {
            if (!allActions["delete"] || isCustomAction(allActions["delete"])) {
                return;
            }
            if (actionAvailable && actionAvailable["delete"]) {
                if (typeof actionAvailable["delete"] == "function") {
                    if (!actionAvailable["delete"](data)) {
                        return;
                    }
                }
            }
            _this.deleteItem(data);
        });
        table.events.listenBy(this, "edit", function (data) {
            if (!allActions["edit"] || isCustomAction(allActions["edit"])) {
                return;
            }
            if (actionAvailable && actionAvailable["edit"]) {
                if (typeof actionAvailable["edit"] == "function") {
                    if (!actionAvailable["edit"](data)) {
                        return;
                    }
                }
            }
            var formDefinition = helpers_1.cloneObject(_this.definition.form || {});
            formDefinition.fields =
                formDefinition.fields || _this.definition.table.fields;
            formDefinition.data = data;
            var se = new sillyEditor_1.SillyEditor(formDefinition);
            se.asModal.VM.title = _this.definition.title;
            se.edit(function (error, result) {
                if (error) {
                    console.error(error);
                    return;
                }
                for (var name_1 in data) {
                    var value = result[name_1];
                    if (value == undefined || value == null) {
                        result[name_1] = data[name_1];
                    }
                }
                _this.editItem(data, result);
            });
        });
        var _loop_2 = function (a) {
            var action = allActions[a];
            if (isCustomAction(action)) {
                var handler_1 = action.handler;
                table.events.listenBy(this_1, a, function (data) {
                    handler_1(_this, data);
                });
            }
        };
        var this_1 = this;
        for (var a in allActions) {
            _loop_2(a);
        }
        this.setValue(items);
    };
    DataListEditor.prototype.getValue = function () {
        return this.table.getAll();
    };
    DataListEditor.prototype.setValue = function (items) {
        this.table.from(items || []);
    };
    DataListEditor.prototype.onClickAdd = function () {
        var _this = this;
        var formDefinition = helpers_1.cloneObject(this.definition.form || {});
        formDefinition.fields =
            formDefinition.fields || this.definition.table.fields;
        var se = new sillyEditor_1.SillyEditor(formDefinition);
        se.asModal.VM.title = this.definition.title;
        se.edit(function (error, result) {
            if (error) {
                console.error(error);
                return;
            }
            _this.addItem(result);
        });
    };
    DataListEditor.prototype.renderPagination = function (option) {
        var _this = this;
        var pageIndex = option.pageIndex, pageSize = option.pageSize, pageLimit = option.pageLimit;
        this.pagination = new sillyPagination_1.SillyPagination();
        this.events.on("refresh", function (option) {
            var _a = option.paginate, pageIndex = _a.pageIndex, pageTotal = _a.pageTotal, total = _a.total;
            _this.setValue(option.paginate.items);
            _this.pagination.setValue({
                pageIndex: option.paginate.pageIndex,
                pageTotal: option.paginate.pageTotal,
                pageLimit: pageLimit,
                pageSize: pageSize,
                total: total
            });
        });
        this.refresh({
            query: {
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        });
        this.pagination.events.listenBy(this, "paging", function (index) {
            _this.refresh({
                query: {
                    pageIndex: index,
                    pageSize: pageSize,
                }
            });
        });
    };
    DataListEditor.prototype.renderFilter = function (option) {
        var _this = this;
        this.filter = new sillyFilter_1.SillyFilter(option);
        this.filter.events.listenBy(this, "query", function (query) {
            query.pageIndex = 0;
            _this.refresh({ query: query });
        });
    };
    return DataListEditor;
}(R.DataListEditor));
exports.DataListEditor = DataListEditor;
function isCustomAction(action) {
    return action.displayText !== undefined;
}
var sillyTable_1 = require("./base/sillyTable");
var sillyEditor_1 = require("./base/sillyEditor");
var sillyPagination_1 = require("./base/sillyPagination");
var sillyFilter_1 = require("./base/sillyFilter");
