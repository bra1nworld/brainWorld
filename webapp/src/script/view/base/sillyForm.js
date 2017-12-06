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
var sillyDropdown_1 = require("./sillyDropdown");
var SillyForm = /** @class */ (function (_super) {
    __extends(SillyForm, _super);
    function SillyForm(definition) {
        var _this = _super.call(this) || this;
        _this.definition = definition;
        _this.fieldMap = {};
        var data = definition.data || {};
        var types = definition.types || {};
        var metas = definition.metas || {};
        var descriptions = definition.descriptions || {};
        _this.definition.optional = _this.definition.optional || {};
        for (var name_1 in definition.fields) {
            var displayName = definition.fields[name_1];
            var meta = metas[name_1];
            var type = types[name_1] || "text";
            var Field = Fields[type] || TextField;
            var field = new Field(name_1, displayName);
            if (field.setMeta && meta) {
                field.setMeta(meta);
            }
            _this.fieldMap[name_1] = field;
            _this.fields.push(field);
            var value = data[name_1];
            if (value || value === false) {
                field.setValue(value);
            }
            field.events.listenBy(_this, "change", function () {
                //let kv = {} as any
                //kv[name] = field.getValue(true)
                // let kv = this.getValue(true)
                // this.reviewDepends(kv)
            });
            if (descriptions[name_1]) {
                field["VM"].description = descriptions[name_1];
            }
            if (definition.readonly === true || definition.readonly && definition.readonly[field.name]) {
                field.readonly();
                field.node.addEventListener("mousedown", function (e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }, true);
                field.setOptional();
            }
            var optionalKey = name_1;
            if (_this.isOptional(definition.optional[optionalKey])) {
                field.setOptional();
            }
        }
        if (definition.readonly === true) {
            _this.VM.readonly = true;
        }
        else {
            _this.VM.readonly = false;
        }
        _this.reviewDepends(definition.data || {});
        if (definition.readonly === true) {
            _this.node.addEventListener("mousedown", function (e) {
                e.stopImmediatePropagation();
                e.preventDefault();
            });
        }
        return _this;
    }
    SillyForm.prototype.reviewDepends = function (value) {
        var depends = this.definition.depends || {};
        for (var _i = 0, _a = this.fields.toArray(); _i < _a.length; _i++) {
            var field = _a[_i];
            var depend = depends[field.name];
            if (depend) {
                if (!depend(value)) {
                    field.node.classList.add("hide");
                    field.undepend = true;
                }
                else {
                    field.node.classList.remove("hide");
                    field.undepend = false;
                }
            }
        }
    };
    SillyForm.prototype.getValue = function (trial) {
        var result = {};
        if (!trial) {
            this.reviewDepends(this.getValue(true));
        }
        for (var _i = 0, _a = this.fields.toArray(); _i < _a.length; _i++) {
            var item = _a[_i];
            var name_2 = item.name;
            item.optional = this.definition.optional[name_2] || this.definition.optional === true;
            var value = item.getValue(trial);
            if (!trial && (!value || value instanceof Array && value.length == 0) && value !== 0 && typeof value !== "boolean" && !this.isOptional(this.definition.optional[name_2]) && this.definition.optional !== true && !item.undepend) {
                alert("\u8BF7\u586B\u5199\"" + item.displayText + "\"");
                throw new Error("Invalid parameter " + item.name);
            }
            result[name_2] = value;
        }
        var computes = this.definition.computes || {};
        for (var name_3 in computes) {
            result[name_3] = computes[name_3](result);
        }
        if (trial)
            return result;
        var validates = this.definition.validates || {};
        // validate things
        for (var _b = 0, _c = this.fields.toArray(); _b < _c.length; _b++) {
            var item = _c[_b];
            var name_4 = item.name;
            if (typeof validates[name_4] === "function") {
                validates[name_4](result[name_4], result);
            }
        }
        return result;
    };
    SillyForm.prototype.isOptional = function (opt) {
        if (typeof opt === "function") {
            return opt(this.getValue(true));
        }
        else {
            if (opt === true)
                return true;
        }
        return false;
    };
    SillyForm.prototype.clear = function () {
        for (var _i = 0, _a = this.fields.toArray(); _i < _a.length; _i++) {
            var field = _a[_i];
            field.clear();
        }
    };
    return SillyForm;
}(R.Base.SillyForm));
exports.SillyForm = SillyForm;
var SettlementAmountField = /** @class */ (function (_super) {
    __extends(SettlementAmountField, _super);
    function SettlementAmountField(name, displayText) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.displayText = displayText;
        _this.events = new Leaf.EventEmitter();
        if (_this.optional) {
            _this.VM.optional = "optional";
        }
        return _this;
    }
    SettlementAmountField.prototype.getValue = function () {
        return;
    };
    SettlementAmountField.prototype.setValue = function (value) {
        this.VM.displayText = value;
    };
    SettlementAmountField.prototype.clear = function () { };
    SettlementAmountField.prototype.readonly = function () { };
    SettlementAmountField.prototype.setOptional = function () {
        this.VM.optional = "optional";
    };
    return SettlementAmountField;
}(R.Base.SillyForm.SettlementAmount));
exports.SettlementAmountField = SettlementAmountField;
var TextField = /** @class */ (function (_super) {
    __extends(TextField, _super);
    function TextField(name, displayText) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.displayText = displayText;
        _this.events = new Leaf.EventEmitter();
        _this.VM.displayText = displayText;
        return _this;
    }
    TextField.prototype.onChangeInput = function () {
        this.events.emit("change");
    };
    TextField.prototype.getValue = function () {
        return this.UI.input.value;
    };
    TextField.prototype.setValue = function (value) {
        this.UI.input.value = value;
    };
    TextField.prototype.clear = function () {
        this.UI.input.value = "";
    };
    TextField.prototype.readonly = function () {
        this.isReadonly = true;
        this.VM.readonly = true;
    };
    TextField.prototype.setOptional = function () {
        this.VM.optional = "optional";
    };
    return TextField;
}(R.Base.SillyForm.TextField));
exports.TextField = TextField;
var PasswordField = /** @class */ (function (_super) {
    __extends(PasswordField, _super);
    function PasswordField(name, displayText) {
        var _this = _super.call(this, name, displayText) || this;
        _this.name = name;
        _this.displayText = displayText;
        _this.UI.input.type = "password";
        return _this;
    }
    return PasswordField;
}(TextField));
exports.PasswordField = PasswordField;
var RpcIdField = /** @class */ (function (_super) {
    __extends(RpcIdField, _super);
    function RpcIdField(name, displayText) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.displayText = displayText;
        _this.events = new Leaf.EventEmitter();
        _this.VM.displayText = displayText;
        return _this;
    }
    RpcIdField.prototype.onChangeInput = function () {
        this.events.emit("change");
    };
    RpcIdField.prototype.getValue = function (trial) {
        console.log("trial" + trial);
        var value = this.UI.input.value.toString();
        if (value && value.length !== 15 && value.length !== 18) {
            alert("身份证格式不正确");
            throw new Error("invalid rpc id");
        }
        return value;
    };
    RpcIdField.prototype.setValue = function (value) {
        this.UI.input.value = value;
    };
    RpcIdField.prototype.clear = function () {
        this.UI.input.value = "";
    };
    RpcIdField.prototype.readonly = function () {
        this.isReadonly = true;
        this.VM.readonly = true;
    };
    RpcIdField.prototype.setOptional = function () {
        this.VM.optional = "optional";
    };
    return RpcIdField;
}(R.Base.SillyForm.RpcIdField));
exports.RpcIdField = RpcIdField;
var IntField = /** @class */ (function (_super) {
    __extends(IntField, _super);
    function IntField(name, displayText) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.displayText = displayText;
        _this.events = new Leaf.EventEmitter();
        _this.VM.displayText = displayText;
        return _this;
    }
    IntField.prototype.onChangeInput = function () {
        this.events.emit("change");
    };
    IntField.prototype.getValue = function (trial) {
        var value = parseInt(this.UI.input.value.trim());
        if (value >= 0) {
            this.setValue(value);
            return this.UI.input.value;
        }
        if (trial)
            return;
        alert("请填写整数");
        throw new Error("请填写整数");
    };
    IntField.prototype.setValue = function (value) {
        this.UI.input.value = value;
    };
    IntField.prototype.clear = function () {
        this.UI.input.value = "";
    };
    IntField.prototype.readonly = function () {
        this.isReadonly = true;
        this.VM.readonly = true;
    };
    IntField.prototype.setOptional = function () {
        this.VM.optional = "optional";
    };
    return IntField;
}(R.Base.SillyForm.IntField));
exports.IntField = IntField;
var ParagraphField = /** @class */ (function (_super) {
    __extends(ParagraphField, _super);
    function ParagraphField(name, displayText) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.displayText = displayText;
        _this.events = new Leaf.EventEmitter();
        _this.VM.displayText = displayText;
        return _this;
    }
    ParagraphField.prototype.onChangeInput = function () {
        this.events.emit("change");
    };
    ParagraphField.prototype.getValue = function () {
        return this.UI.input.value;
    };
    ParagraphField.prototype.setValue = function (value) {
        this.UI.input.value = value;
    };
    ParagraphField.prototype.clear = function () {
        this.UI.input.value = "";
    };
    ParagraphField.prototype.readonly = function () {
        this.isReadonly = true;
        this.VM.readonly = true;
    };
    ParagraphField.prototype.setOptional = function () {
        this.VM.optional = "optional";
    };
    return ParagraphField;
}(R.Base.SillyForm.ParagraphField));
exports.ParagraphField = ParagraphField;
var DictField = /** @class */ (function (_super) {
    __extends(DictField, _super);
    function DictField(name, displayText) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.displayText = displayText;
        _this.dropdown = new sillyDropdown_1.SillyDropdown(_this.displayText);
        _this.events = new Leaf.EventEmitter();
        _this.VM.displayText = displayText;
        _this.dropdown.events.listenBy(_this, "change", _this.events.emit.bind(_this.events, "change"));
        return _this;
    }
    DictField.prototype.setMeta = function (name) {
        this.dropdown.setOptionDict(name);
    };
    DictField.prototype.getValue = function () {
        return this.dropdown.getValue();
    };
    DictField.prototype.setValue = function (value) {
        this.dropdown.setValue(value);
    };
    DictField.prototype.clear = function () {
        this.dropdown.clear();
    };
    DictField.prototype.readonly = function () {
        this.dropdown.readonly();
        this.isReadonly = true;
        this.VM.readonly = true;
    };
    DictField.prototype.setOptional = function () {
        this.VM.optional = "optional";
    };
    return DictField;
}(R.Base.SillyForm.DictField));
exports.DictField = DictField;
var Fields = {
    text: TextField,
    paragraph: ParagraphField,
    password: PasswordField,
    dict: DictField,
    int: IntField,
    rpcId: RpcIdField,
};
