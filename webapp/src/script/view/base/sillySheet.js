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
var SillySheet = /** @class */ (function (_super) {
    __extends(SillySheet, _super);
    function SillySheet(option) {
        var _this = _super.call(this) || this;
        _this.option = option;
        var data = option.data || {};
        var fields = option.fields || {};
        var types = option.types || {};
        var metas = option.metas || {};
        var rows = option.rows || 2;
        var count = 1;
        var list;
        for (var name_1 in option.fields) {
            list.push({
                title: name_1,
                data: option.fields[name_1]
            });
        }
        console.log(list);
        return _this;
    }
    return SillySheet;
}(R.Base.SillySheet));
exports.SillySheet = SillySheet;
