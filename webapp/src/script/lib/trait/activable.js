"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Activable = /** @class */ (function () {
    function Activable(owner, isActive) {
        if (isActive === void 0) { isActive = false; }
        this.owner = owner;
        this.isActive = isActive;
        this.events = new Leaf.EventEmitter();
    }
    Activable.prototype.activate = function () {
        if (this.isActive)
            return;
        this.isActive = true;
        if (this.owner.onActivate) {
            this.owner.onActivate();
        }
        if (this.owner.onActiveChange) {
            this.owner.onActiveChange(this.isActive);
        }
        this.events.emit("active");
        this.events.emit("change", this.isActive);
    };
    Activable.prototype.deactivate = function () {
        if (!this.isActive)
            return;
        this.isActive = false;
        if (this.owner.onDeactivate) {
            this.owner.onDeactivate();
        }
        if (this.owner.onActiveChange) {
            this.owner.onActiveChange(this.isActive);
        }
        this.events.emit("deactive");
        this.events.emit("change", this.isActive);
    };
    return Activable;
}());
exports.Activable = Activable;
