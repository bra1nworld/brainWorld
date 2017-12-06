"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var Validators = require("../validators");
var Leaf = require("leaf-ts");
var OptionMatch = Validators.Decorator.OptionMatch;
var DbPaginateQuery = /** @class */ (function () {
    function DbPaginateQuery(collection) {
        this.collection = collection;
    }
    DbPaginateQuery.prototype.query = function (option, callback) {
        var _this = this;
        option.pageIndex = option.pageIndex || 0;
        var pageSize = option.pageSize || 20;
        this.collection.count(option.query || {}, function (err, count) {
            if (err) {
                callback(new errors_1.Errors.UnknownError("Fail to count", { via: err }));
                return;
            }
            var cursor = _this.collection.find(option.query);
            option.sortBy = option.sortBy || {
                _id: -1
            };
            if (option.sortBy) {
                cursor.sort(option.sortBy);
            }
            cursor.skip(option.pageIndex * pageSize).limit(pageSize).toArray(function (err, result) {
                if (err) {
                    callback(new errors_1.Errors.UnknownError("Fail to get items"));
                    return;
                }
                callback(null, {
                    pageIndex: option.pageIndex,
                    pageTotal: Math.ceil(count / pageSize),
                    items: result,
                    total: count
                });
            });
        });
    };
    __decorate([
        OptionMatch(new Leaf.Validator()
            .field("index").error(new errors_1.Errors.InvalidParameter("Invalid query index")).int())
    ], DbPaginateQuery.prototype, "query", null);
    return DbPaginateQuery;
}());
exports.DbPaginateQuery = DbPaginateQuery;
//# sourceMappingURL=dbPaginateQuery.js.map