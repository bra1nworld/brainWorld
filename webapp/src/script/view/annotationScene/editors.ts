import { Constructor, PopupEditor, Form } from "../form"
import { ObjectTypesDict } from "../../dict"

export const AnnotationCreateEditor = Form.create<SceneAnnotation.Annotation, typeof PopupEditor>({
    fields: {
        id: "ID",
        color: "color",
        objectType: "type",
        // type: "标注方式"
    },
    types: {
        id: "span",
        // type: "selection",
        color: "color",
        objectType: "selection"
    },
    metas: {
        objectType: {
            options: ObjectTypesDict
        },
    }
}, PopupEditor) as Constructor<PopupEditor<SceneAnnotation.Annotation>>

export const AnnotationInfoEditor = Form.create<SceneAnnotation.Annotation, typeof PopupEditor>({
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
            options: ObjectTypesDict
        }
    }
}, PopupEditor) as Constructor<PopupEditor<SceneAnnotation.Annotation>>

