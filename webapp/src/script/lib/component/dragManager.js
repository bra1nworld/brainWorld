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
// drag-move
// drag-drop
// drag-finish
// drag-cancel
var DragManager = /** @class */ (function () {
    function DragManager() {
        var _this = this;
        this.listenerEvents = ["mousedown", "mouseup", "mousemove"];
        this.capture = true;
        // body will add this class when we are dragging
        this.bodyDraggingClass = "dragging";
        this.behavior = new DragManager.Behavior(this);
        this.shadow = new DragManager.ShadowManager(this);
        this.lifeCircle = new DragManager.LifeCircle(this);
        for (var _i = 0, _a = this.listenerEvents; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var fnName = name_1 + "Listener";
            this[fnName] = function (e) {
                _this.lastEvent = e;
                _this.lifeCircle.feed("mouse", e);
            };
        }
    }
    DragManager.prototype.initialize = function () {
        this.attachListeners();
        this.lifeCircle.init();
    };
    DragManager.prototype.attachListeners = function () {
        for (var _i = 0, _a = this.listenerEvents; _i < _a.length; _i++) {
            var name_2 = _a[_i];
            window.addEventListener(name_2, this[name_2 + "Listener"], this.capture);
        }
    };
    DragManager.prototype.detachListeners = function () {
        for (var _i = 0, _a = this.listenerEvents; _i < _a.length; _i++) {
            var name_3 = _a[_i];
            window.removeEventListener(name_3, this[name_3 + "Listener"]);
        }
    };
    return DragManager;
}());
exports.DragManager = DragManager;
(function (DragManager) {
    var LifeCircle = /** @class */ (function (_super) {
        __extends(LifeCircle, _super);
        function LifeCircle(dragManager) {
            var _this = _super.call(this) || this;
            _this.dragManager = dragManager;
            return _this;
        }
        LifeCircle.prototype.init = function () {
            if (this.state === "void") {
                this.setState("waitMouseDown");
            }
        };
        LifeCircle.prototype.reset = function () {
            _super.prototype.reset.call(this);
            if (this.dragManager)
                this.dragManager.behavior.clearDrag();
        };
        LifeCircle.prototype.atWaitMouseDown = function () {
            var _this = this;
            this.dragManager.behavior.clearDrag();
            this.consumeWhenAvailable("mouse", function (e) {
                if (e.type === "mousedown") {
                    _this.data.initMouseDown = e;
                    _this.setState("waitInitMouseMove");
                }
                else {
                    _this.setState("waitMouseDown");
                }
            });
        };
        LifeCircle.prototype.atWaitInitMouseMove = function () {
            var _this = this;
            this.consumeWhenAvailable("mouse", function (e) {
                if (e.type === "mousemove") {
                    if (MouseEventHelper.getMouseDistance(e, _this.data.initMouseDown) < _this.dragManager.minMovement) {
                        _this.setState("waitInitMouseMove");
                    }
                    else {
                        _this.data.initMoveEvent = e;
                        _this.setState("handleInitMove");
                    }
                }
                else {
                    _this.setState("waitMouseDown");
                }
            });
        };
        LifeCircle.prototype.atHandleInitMove = function () {
            if (!this.dragManager.behavior.dragStart(this.data.initMouseDown)) {
                this.setState("waitMouseDown");
                return;
            }
            this.setState("waitMouseContinue");
        };
        LifeCircle.prototype.atWaitMouseContinue = function () {
            var _this = this;
            this.consumeWhenAvailable("mouse", function (e) {
                if (e.type === "mousemove") {
                    _this.dragManager.behavior.dragMove(e);
                    _this.setState("waitMouseContinue");
                }
                else if (e.type === "mouseup") {
                    _this.data.finalUpEvent = e;
                    _this.setState("handleMouseUp");
                }
                else {
                    _this.setState("waitMouseDown");
                }
            });
        };
        LifeCircle.prototype.atHandleMouseUp = function () {
            this.dragManager.behavior.drop(this.data.finalUpEvent);
            this.setState("waitMouseDown");
        };
        return LifeCircle;
    }(Leaf.States));
    DragManager.LifeCircle = LifeCircle;
    var MouseEventHelper = /** @class */ (function () {
        function MouseEventHelper() {
        }
        MouseEventHelper.computeRelativeMousePosition = function (el, e) {
            var src = this.getMouseSrc(e);
            if (!el.contains(src))
                return null;
            var rect = el.getBoundingClientRect();
            return {
                x: rect.left - e.clientX,
                y: rect.top - e.clientY
            };
        };
        MouseEventHelper.getMouseSrc = function (e) {
            if (!e)
                return null;
            return e.srcElement || e.target;
        };
        MouseEventHelper.isElementDraggable = function (el) {
            return el && (el.dragSupport === "enabled" || el.getAttribute("drag-support") === "enabled");
        };
        MouseEventHelper.isElementDragless = function (el) {
            return !el || (el.dragSupport === "disabled" || el.getAttribute("drag-support") === "disabled");
        };
        MouseEventHelper.getDefaultShadow = function (el) {
            var copy = document.createElement("div");
            copy.style.width = "100px";
            copy.style.height = "100px";
            copy.style.border = "3px solid rgba(0,0,0,0.7)";
            copy.style.opacity = "0.5";
            copy.style.backgroundColor = "white";
            copy.style.pointerEvents = "none";
            copy.style.transition = "opacity 200ms";
            copy.style.transform = "scale(0.7)";
            return copy;
        };
        MouseEventHelper.getMousePosition = function (e) {
            if (!e)
                return null;
            return {
                x: e.clientX,
                y: e.clientY
            };
        };
        MouseEventHelper.getMouseDistance = function (e1, e2) {
            var p1 = this.getMousePosition(e1);
            var p2 = this.getMousePosition(e2);
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        MouseEventHelper.getDraggable = function (e) {
            var el = this.getMouseSrc(e);
            while (el) {
                if (this.isElementDragless(el)) {
                    return null;
                }
                else if (this.isElementDraggable(el)) {
                    return el;
                }
                el = el.parentElement;
            }
        };
        MouseEventHelper.createCustomEvent = function (name, data) {
            return new CustomEvent(name, data);
        };
        return MouseEventHelper;
    }());
    DragManager.MouseEventHelper = MouseEventHelper;
    var Behavior = /** @class */ (function () {
        function Behavior(dragManager) {
            this.dragManager = dragManager;
            var preventDefault = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
            };
            var draggingElement = null;
            // preventing 
            Object.defineProperty(this, "draggingElement", {
                get: function () {
                    return draggingElement;
                },
                set: function (v) {
                    if (draggingElement) { }
                    if (v === draggingElement)
                        return;
                    if (draggingElement) {
                        var el_1 = draggingElement;
                        setTimeout(function () {
                            el_1.removeEventListener("click", preventDefault, true);
                        }, 1);
                    }
                    draggingElement = v;
                    if (!v)
                        return;
                    draggingElement.addEventListener("click", preventDefault, true);
                }
            });
        }
        Behavior.prototype.clearDrag = function () {
            this.dragManager.shadow.clear();
            this.draggingElement = null;
            document.body.classList.remove(this.dragManager.bodyDraggingClass);
        };
        Behavior.prototype.dragStart = function (e) {
            var src = MouseEventHelper.getDraggable(e);
            this.clearDrag();
            if (!src)
                return false;
            e.preventDefault();
            e.stopImmediatePropagation();
            document.body.classList.add(this.dragManager.bodyDraggingClass);
            this.dragSession = new Session(this.dragManager);
            this.currentDraggable = src;
            var event = MouseEventHelper.createCustomEvent("drag-init", {
                detail: this.dragSession,
                bubbles: true
            });
            src.dispatchEvent(event);
            this.draggingElement = src;
            if (this.draggingElement.dragBehavior === "auto" || this.draggingElement.getAttribute("drag-behavior") === "auto") {
                this.dragManager.shadow.shadowScale = 0.7;
                this.dragManager.shadow.setDraggingStyle();
                this.dragManager.shadow.setShadowElement(MouseEventHelper.getDefaultShadow(this.draggingElement), MouseEventHelper.computeRelativeMousePosition(src, e));
            }
            return true;
        };
        Behavior.prototype.dragMove = function (e) {
            var event = MouseEventHelper.createCustomEvent("drag-move", {
                detail: this.dragSession,
                bubbles: true
            });
            if (this.draggingElement) {
                this.draggingElement.dispatchEvent(event);
            }
            var target = MouseEventHelper.getMouseSrc(e);
            event = MouseEventHelper.createCustomEvent("drag-stand", {
                detail: this.dragSession,
                bubbles: true
            });
            target.dispatchEvent(event);
            if (!event.defaultPrevented) {
                for (var _i = 0, _a = this.dragSession.protocols; _i < _a.length; _i++) {
                    var p = _a[_i];
                    var event_1 = MouseEventHelper.createCustomEvent("drag-stand/" + p.type, {
                        detail: this.dragSession,
                        protocol: p,
                        bubbles: true
                    });
                    target.dispatchEvent(event_1);
                }
            }
            target.dispatchEvent(event);
            this.dragManager.shadow.updateShadowPosition();
        };
        Behavior.prototype.drop = function (e) {
            this.dragManager.shadow.restoreDraggingStyle();
            var target = MouseEventHelper.getMouseSrc(e);
            var event = MouseEventHelper.createCustomEvent("drag-drop", {
                detail: this.dragSession,
                bubbles: true
            });
            target.dispatchEvent(event);
            if (!event.defaultPrevented) {
                for (var _i = 0, _a = this.dragSession.protocols; _i < _a.length; _i++) {
                    var p = _a[_i];
                    var event_2 = MouseEventHelper.createCustomEvent("drag-drop/" + p.type, {
                        detail: this.dragSession,
                        bubbles: true
                    });
                    target.dispatchEvent(event_2);
                }
            }
            event = MouseEventHelper.createCustomEvent("drag-finish", {
                detail: this.dragSession,
                bubbles: true
            });
            if (this.draggingElement.contains(target)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            if (this.dragSession.isConsumed) {
                event = MouseEventHelper.createCustomEvent("drag-cancel", {
                    detail: this.dragSession,
                    bubbles: true
                });
            }
            this.draggingElement.dispatchEvent(event);
            this.draggingElement = null;
            this.dragManager.shadow.clear();
        };
        return Behavior;
    }());
    DragManager.Behavior = Behavior;
    var ShadowManager = /** @class */ (function () {
        function ShadowManager(dragManager) {
            this.dragManager = dragManager;
            this.dragFix = {
                x: 0, y: 0
            };
            this.savedStyle = null;
            // scaling the shadow
            this.shadowScale = 0.7;
            this.shadowZIndex = 1000000;
        }
        ShadowManager.prototype.setShadowElement = function (el, fix) {
            if (fix === void 0) { fix = { x: 0, y: 0 }; }
            if (this.draggingShadow && this.draggingShadow.parentElement) {
                this.draggingShadow.parentElement.removeChild(this.draggingShadow);
            }
            this.draggingShadow = el;
            document.body.appendChild(el);
            el.style.position = "absolute";
            el.style.pointerEvents = "none";
            el.style.top = "0";
            el.style.left = "0";
            el.style.zIndex = this.shadowZIndex.toString();
            this.dragFix = fix || { x: 0, y: 0 };
            if (!this.dragFix.x)
                this.dragFix.x = 0;
            if (!this.dragFix.y)
                this.dragFix.y = 0;
            this.updateShadowPosition();
        };
        ShadowManager.prototype.updateShadowPosition = function () {
            if (!this.draggingShadow)
                return;
            var point = MouseEventHelper.getMousePosition(this.dragManager.lastEvent);
            var scaleFix = this.shadowScale || 0.7;
            this.draggingShadow.style.position = "absolute";
            this.draggingShadow.style.left = point.x + this.dragFix.x * scaleFix + "px";
            this.draggingShadow.style.top = point.y + this.dragFix.y * scaleFix + "px";
            this.draggingShadow.style.transform = "scale(${this.shadowScale})";
            if (!this.draggingShadow.parentElement) {
                document.body.appendChild(this.draggingShadow);
            }
        };
        ShadowManager.prototype.setDraggingStyle = function () {
            if (this.savedElement) {
                this.restoreDraggingStyle();
            }
            this.savedElement = this.dragManager.behavior.draggingElement;
            this.savedStyle = {
                opacity: this.savedElement.style.opacity,
                transition: this.savedElement.style.transition
            };
            this.savedElement.style.opacity = "0.15";
            this.savedElement.style.transition = "all 200ms";
        };
        ShadowManager.prototype.clear = function () {
            if (this.draggingShadow && this.draggingShadow.parentElement) {
                this.draggingShadow.parentElement.removeChild(this.draggingShadow);
            }
            this.draggingShadow = null;
        };
        ShadowManager.prototype.restoreDraggingStyle = function () {
            if (this.savedElement) {
                this.savedElement.style.opacity = this.savedStyle.opacity;
                this.savedElement.style.transition = this.savedStyle.transition;
            }
            this.savedElement = null;
        };
        return ShadowManager;
    }());
    DragManager.ShadowManager = ShadowManager;
    var Session = /** @class */ (function () {
        function Session(dragManager) {
            var _this = this;
            this.dragManager = dragManager;
            this.protocols = [];
            this.isConsumed = false;
            Object.defineProperty(this, "protocol", {
                get: function () {
                    return _this.protocols[0];
                }
            });
        }
        Session.prototype.add = function (p) {
            this.protocols.push(p);
        };
        Session.prototype.consume = function () {
            this.isConsumed = true;
        };
        return Session;
    }());
    DragManager.Session = Session;
    DragManager.instance = new DragManager();
})(DragManager = exports.DragManager || (exports.DragManager = {}));
exports.DragManager = DragManager;
