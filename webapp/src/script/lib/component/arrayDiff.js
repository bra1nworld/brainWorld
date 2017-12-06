"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayDiff = /** @class */ (function () {
    function ArrayDiff() {
    }
    ArrayDiff.diff = function (arr1, arr2, identical) {
        if (arr1 === void 0) { arr1 = []; }
        if (arr2 === void 0) { arr2 = []; }
        if (!identical) {
            identical = function (a, b) {
                return a === b;
            };
        }
        arr1 = arr1.slice();
        arr2 = arr2.slice();
        var interact = [];
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (identical(arr2[j], arr1[i])) {
                    interact.push(arr1[i]);
                    arr1.splice(i, 1);
                    arr2.splice(j, 1);
                    console.log("arr diff?", i);
                    i--;
                    break;
                }
            }
        }
        return {
            left: arr1,
            right: arr2,
            interact: interact
        };
    };
    return ArrayDiff;
}());
exports.ArrayDiff = ArrayDiff;
