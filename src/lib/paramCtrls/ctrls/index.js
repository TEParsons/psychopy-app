export { default as SingleLineCtrl } from "./SingleLineCtrl.svelte";
export { default as MultiLineCtrl } from "./MultiLineCtrl.svelte";
export { default as NameCtrl } from "./NameCtrl.svelte";
export { default as BoolCtrl } from "./BoolCtrl.svelte";
export { default as ChoiceCtrl } from "./ChoiceCtrl.svelte";
export { default as VersionCtrl } from "./VersionCtrl.svelte";
export { default as FileCtrl } from "./FileCtrl.svelte";
export { default as DictCtrl } from "./DictCtrl.svelte";
export { default as MultipleChoiceCtrl } from "./MultipleChoiceCtrl.svelte";
export { default as FileListCtrl } from "./FileListCtrl.svelte";
export { default as TableCtrl } from "./TableCtrl.svelte";
export { default as ConditionsCtrl } from "./ConditionsCtrl.svelte";
export { default as DeviceCtrl } from "./DeviceCtrl.svelte";
export { default as RichChoiceCtrl } from "./RichChoiceCtrl.svelte";
export { default as SurveyCtrl } from "./SurveyCtrl.svelte";
export { default as CodeCtrl } from "./CodeCtrl.svelte";
export { default as ValidatorCtrl } from "./ValidatorCtrl.svelte";
export { default as KeyPressCtrl } from "./KeyPressCtrl.svelte";
export { default as SoundCtrl } from "./SoundCtrl.svelte";

import {
    SingleLineCtrl,
    MultiLineCtrl,
    CodeCtrl,
    NameCtrl,
    ChoiceCtrl,
    VersionCtrl,
    MultipleChoiceCtrl,
    DeviceCtrl,
    RichChoiceCtrl,
    BoolCtrl,
    FileCtrl,
    SoundCtrl,
    // FontCtrl,
    SurveyCtrl,
    FileListCtrl,
    TableCtrl,
    ConditionsCtrl,
    // ColorCtrl,
    DictCtrl,
    // InvalidCtrl,
    ValidatorCtrl,
    KeyPressCtrl
} from ".";


export var mapping = {
    "single": SingleLineCtrl,
    "multi": MultiLineCtrl,
    "code": CodeCtrl,
    "name": NameCtrl,
    "choice": ChoiceCtrl,
    "version": VersionCtrl,
    "multiChoice": MultipleChoiceCtrl,
    "device": DeviceCtrl,
    "richChoice": RichChoiceCtrl,
    "bool": BoolCtrl,
    "file": FileCtrl,
    "soundFile": SoundCtrl,
    // "font": FontCtrl,
    "survey": SurveyCtrl,
    "fileList": FileListCtrl,
    "table": TableCtrl,
    "conditions": ConditionsCtrl,
    // "color": ColorCtrl,
    "dict": DictCtrl,
    // "inv": InvalidCtrl,
    "validator": ValidatorCtrl,
    "keypress": KeyPressCtrl
}