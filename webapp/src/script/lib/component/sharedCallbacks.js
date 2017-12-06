"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedCallbacks = {
    create: function () {
        var fn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var cbs = fn.callbacks.slice(0);
            fn.clear();
            cbs.forEach(function (callback) {
                callback.apply(void 0, args);
            });
        };
        fn.callbacks = [];
        fn.push = function (callback) {
            fn.callbacks.push(callback);
            fn.count = fn.callbacks.length;
        };
        fn.clear = function () {
            fn.callbacks.length = 0;
            fn.count = 0;
        };
        return fn;
    },
};
exports.default = exports.SharedCallbacks;
