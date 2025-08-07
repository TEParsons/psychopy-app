export { default as SingleLineCtrl } from "./SingleLineCtrl.svelte";
export { default as MultiLineCtrl } from "./MultiLineCtrl.svelte";
export { default as NameCtrl } from "./NameCtrl.svelte";
export { default as BoolCtrl } from "./BoolCtrl.svelte";
export { default as ChoiceCtrl } from "./ChoiceCtrl.svelte";
export { default as FileCtrl } from "./FileCtrl.svelte";
// export { default as ColorCtrl } from "./ColorCtrl.svelte";

import {
    SingleLineCtrl,
    MultiLineCtrl,
    NameCtrl,
    ChoiceCtrl,
    // MultipleChoiceCtrl,
    // RichChoiceCtrl,
    BoolCtrl,
    FileCtrl,
    // FontCtrl,
    // SurveyCtrl,
    // FileListCtrl,
    // TableCtrl,
    // ColorCtrl,
    // DictCtrl,
    // InvalidCtrl,
} from ".";


export var mapping = {
    "single": SingleLineCtrl,
    "multi": MultiLineCtrl,
    "name": NameCtrl,
    "choice": ChoiceCtrl,
    // "multiChoice": MultipleChoiceCtrl,
    // "richChoice": RichChoiceCtrl,
    "bool": BoolCtrl,
    "file": FileCtrl,
    // "font": FontCtrl,
    // "survey": SurveyCtrl,
    // "fileList": FileListCtrl,
    // "table": TableCtrl,
    // "color": ColorCtrl,
    // "dict": DictCtrl,
    // "inv": InvalidCtrl
}