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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FormTemplate = /** @class */ (function () {
    function FormTemplate(fields) {
        this.option = {
            className: "form",
            container: "container"
        };
        this.fieldConstructors = {};
        for (var name_1 in fields) {
            this.register(name_1, fields[name_1]);
        }
    }
    FormTemplate.prototype.config = function (option) {
    };
    FormTemplate.prototype.register = function (name, Con) {
        // first registered field is the default
        if (!this.defaultFieldConstructor)
            this.defaultFieldConstructor = Con;
        this.fieldConstructors[name] = Con;
    };
    FormTemplate.prototype.create = function (option, Base) {
        var form = this;
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            //static extends(newOption: typeof option) {
            //    let op = Leaf.Util.clone(option)
            //    for (let prop in newOption) {
            //        if (typeof op[prop] !== "object" || !op[prop]) {
            //            op[prop] = newOption
            //        }
            //        op[prop] = {
            //            ...op[prop],
            //            ...newOption[prop]
            //        }
            //    }
            //    return form.create(op, Base)
            //}
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = this;
                var el = document.createElement("div");
                el.className = "form";
                el.setAttribute("data-id", "container");
                _this = _super.call(this, el) || this;
                _this.fields = {};
                _this.buildForm();
                return _this;
            }
            class_1.prototype.buildForm = function () {
                // almost same as silly form but there are three condition
                // 1. has existing widget somewhere
                // 2. has a placeholder somewhere
                // 3. has a nothing just append
                // So for each field we will
                // for field in this.option.fields search for node with data-id accordingly
                //     1. find a DOM with identical data-id
                //         1.1 check for corresponding widget and match the field interface => use it
                //         1.2 or check if it is a InputElement => wrap it and use it
                //         1.3 considered as a placeholder => generate the field and replace it, also update this.UI,this.fields
                //     2. gerneate the field and append to the "container"
                // save all generated field to this.fields
                // For now we only generate everything
                var metas = option.metas || {};
                for (var field in option.fields) {
                    var type = option.types[field] || null;
                    var Cons = form.fieldConstructors[type] || form.defaultFieldConstructor;
                    var fieldItem = this.fields[field] = new Cons({
                        name: field,
                        displayName: option.fields[field]
                    });
                    var meta = metas[field];
                    this.UI[form.option.container].appendChild(fieldItem.node);
                    if (meta && fieldItem.setMeta) {
                        fieldItem.setMeta(meta);
                    }
                }
            };
            class_1.prototype.setValue = function (v) {
                for (var name_2 in v) {
                    var field = this.fields[name_2];
                    if (!field)
                        continue;
                    field.setValue(v[name_2]);
                }
                option.data = v;
            };
            class_1.prototype.getValue = function (trial) {
                var result = __assign({}, (option.data || {}));
                for (var name_3 in this.fields) {
                    var field = this.fields[name_3];
                    result[name_3] = field.getValue();
                }
                return result;
            };
            return class_1;
        }(Base));
    };
    return FormTemplate;
}());
exports.FormTemplate = FormTemplate;
