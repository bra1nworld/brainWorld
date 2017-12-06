""; // Usage:
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// QueryParser.parse(window.location) // /abc?a=b&c=d
// returns {a:"b",c:"d"}
var QueryParser = /** @class */ (function () {
    function QueryParser() {
    }
    QueryParser.parse = function (query) {
        var result = {};
        var offset = query.indexOf("?");
        if (offset >= 0) {
            query = query.slice(offset + 1);
        }
        query.split("&").forEach(function (kvs) {
            var _a = kvs.split("="), k = _a[0], v = _a[1];
            result[decodeURIComponent(k)] = decodeURIComponent(v);
        });
        return result;
    };
    QueryParser.encode = function (param, transform) {
        if (transform === void 0) { transform = function (item) {
            if (!item)
                return null;
            return item.toString();
        }; }
        var result = [];
        for (var prop in param) {
            var value = param[prop];
            if (typeof value == "string") {
                result.push([encodeURIComponent(prop), encodeURIComponent(transform(value))].join("="));
            }
        }
        return result.join("&");
    };
    return QueryParser;
}());
exports.QueryParser = QueryParser;
