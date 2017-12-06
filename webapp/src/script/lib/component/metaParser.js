"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MetaParser = /** @class */ (function () {
    function MetaParser() {
    }
    MetaParser.parse = function () {
        var metas = document.querySelectorAll("meta");
        var result = {};
        for (var i = void 0; i < metas.length; i++) {
            var item = metas[i];
            var name_1 = item.getAttribute("name");
            var content = item.getAttribute("content");
            if (!name_1)
                continue;
            if (typeof result[name_1] === "string") {
                result[name_1] = [result[name_1], content];
            }
            else if (result[name_1] instanceof Array) {
                result[name_1].push(content);
            }
            else {
                result[name_1] = content;
            }
        }
        return result;
    };
    return MetaParser;
}());
exports.MetaParser = MetaParser;
