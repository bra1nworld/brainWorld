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
var ActionList = /** @class */ (function (_super) {
    __extends(ActionList, _super);
    function ActionList(type) {
        var _this = _super.call(this) || this;
        _this.VM.type = type;
        var actions = _this.UI.actionList.children;
        var _loop_1 = function (action) {
            action.onclick = function () {
                _this.events.emit("action", action.getAttribute("data-id"));
            };
        };
        for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
            var action = actions_1[_i];
            _loop_1(action);
        }
        return _this;
    }
    return ActionList;
}(R.AnnotationScene.ActionList));
exports.ActionList = ActionList;
