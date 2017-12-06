"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataProvider = /** @class */ (function () {
    function DataProvider(option) {
        this.events = new Leaf.EventEmitter();
        this.dataMap = {};
        this.widget = option.widget;
        this.fetcher = option.fetcher;
    }
    DataProvider.prototype.refresh = function (option) {
        var _this = this;
        if (option === void 0) { option = {}; }
        this.fetcher(option, function (err, result) {
            if (err) {
                _this.events.emit("error", err);
                return;
            }
            _this.fill(result);
        });
        return this;
    };
    DataProvider.prototype.map = function (dataMap) {
        this.dataMap = dataMap;
        return this;
    };
    DataProvider.prototype.fill = function (data) {
        for (var prop in data) {
            if (this.widget.ViewModel.hasKey(prop)) {
                this.widget.VM[prop] = data[prop];
            }
        }
        for (var key in this.dataMap) {
            var mapper = this.dataMap[key];
            if (typeof mapper == "string") {
                this.widget.VM[key] = data[mapper];
            }
            else {
                this.widget.VM[key] = mapper(data);
            }
        }
    };
    return DataProvider;
}());
exports.DataProvider = DataProvider;
var ListDataProvider = /** @class */ (function () {
    function ListDataProvider(option) {
        this.events = new Leaf.EventEmitter();
        this.transformer = function (item) { return item; };
        this.dataMap = {};
        this.list = option.list;
        this.fetcher = option.fetcher;
        this.Item = option.Item;
        this.readonly = option.readonly;
    }
    ListDataProvider.prototype.refresh = function (option) {
        var _this = this;
        if (option === void 0) { option = {}; }
        this.fetcher(option, function (err, result) {
            if (err) {
                _this.events.emit("error", err);
                return;
            }
            _this.fill(result);
        });
    };
    ListDataProvider.prototype.transform = function (transformer) {
        this.transformer = transformer;
    };
    ListDataProvider.prototype.map = function (dataMap) {
        this.dataMap = dataMap;
    };
    ListDataProvider.prototype.insert = function (data, index) {
        if (index === void 0) { index = -1; }
        var item = new this.Item(this.transformer(data), this.readonly);
        for (var prop in data) {
            if (item.ViewModel.hasKey(prop)) {
                item.VM[prop] = data[prop];
            }
        }
        for (var key in this.dataMap) {
            var mapper = this.dataMap[key];
            if (typeof mapper == "string") {
                item.VM[key] = data[mapper];
            }
            else {
                item.VM[key] = mapper(data);
            }
        }
        if (index === -1) {
            this.list.push(item);
        }
        else {
            this.list.splice(index, 0, item);
        }
        return item;
    };
    ListDataProvider.prototype.fill = function (datas) {
        if (this.list.length) {
            this.list.length = 0;
        }
        if (datas && datas.length > 0) {
            for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
                var data = datas_1[_i];
                this.insert(data);
            }
        }
        this.events.emit("finished");
    };
    return ListDataProvider;
}());
exports.ListDataProvider = ListDataProvider;
