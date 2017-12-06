"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Inspector = /** @class */ (function () {
    function Inspector() {
        var _this = this;
        this.indentCount = 4;
        Object.defineProperty(this, "indentStep", {
            get: function () {
                var result = "";
                var count = _this.indentCount;
                while (count > 0) {
                    count -= 1;
                    result += " ";
                }
                return result;
            }
        });
    }
    Inspector.prototype.inspect = function (obj, depth, stack) {
        var _this = this;
        if (depth === void 0) { depth = 10; }
        if (stack === void 0) { stack = []; }
        stack = stack.slice();
        if (depth == 0)
            this.getValueAbbr(obj);
        if (obj === null)
            return "null";
        if (typeof obj === "undefined")
            return "undefined";
        if (typeof obj === "string") {
            return "\"" + obj + "\"";
        }
        if (typeof obj === "number") {
            return obj.toString();
        }
        if (obj instanceof Date) {
            return "Date(\"obj.toString()\")";
        }
        if (obj instanceof Array) {
            if (stack.indexOf(obj) >= 0) {
                return "[Circular Array]";
            }
            stack.push(obj);
            var values = obj.map(function (item) { return _this.inspect(item, depth - 1, stack).trim(); }).join(",\n").trim();
            return "[\n" + this.indent(values) + "\n]";
        }
        if (typeof obj === "function") {
            return "function " + obj.name + "(...)";
        }
        if (obj instanceof Error) {
            return "Error(" + obj.name + ":" + obj.message + ":" + obj.stack + ")";
        }
        if (typeof obj === "object") {
            if (stack.indexOf(obj) >= 0) {
                return "<Circular Object>";
            }
            stack.push(obj);
            var values = Object.keys(obj).map(function (key) { return key + ": " + _this.inspect(obj[key], depth - 1, stack).trim(); }).join(",\n");
            return "{\n" + this.indent(values.trim()) + "\n}";
        }
        return obj.toString();
    };
    Inspector.prototype.getValueAbbr = function (obj) {
        if (obj === null)
            return "null";
        if (typeof obj === "undefined")
            return "undefined";
        if (obj instanceof Array)
            return "[Array of length " + obj.length + "]";
        return obj.toString();
    };
    Inspector.prototype.indent = function (str, indent) {
        if (indent === void 0) { indent = this.indentStep; }
        return indent + str.replace(/\n/g, "\n" + indent).replace(/\s+\n+/g, "");
    };
    return Inspector;
}());
exports.Inspector = Inspector;
