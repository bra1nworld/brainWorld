"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("../form");
var dict_1 = require("../../dict");
exports.AnnotationCreateEditor = form_1.Form.create({
    fields: {
        id: "ID",
        color: "color",
        objectType: "type",
    },
    types: {
        id: "span",
        // type: "selection",
        color: "color",
        objectType: "selection"
    },
    metas: {
        objectType: {
            options: dict_1.ObjectTypesDict
        },
    }
}, form_1.PopupEditor);
exports.AnnotationInfoEditor = form_1.Form.create({
    fields: {
        id: "ID",
        color: "color",
        objectType: "type"
    },
    types: {
        id: "span",
        color: "color",
        objectType: "selection"
    },
    metas: {
        objectType: {
            options: dict_1.ObjectTypesDict
        }
    }
}, form_1.PopupEditor);
