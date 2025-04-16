import SingleLineCtrl from "./SingleLineCtrl.svelte";
import MultiLineCtrl from "./MultiLineCtrl.svelte";
import ChoiceCtrl from "./ChoiceCtrl.svelte";
import CheckboxCtrl from "./CheckboxCtrl.svelte";
import FileCtrl from "./FileCtrl.svelte";


export var mapping = {
    "single": SingleLineCtrl,
    "multi": MultiLineCtrl,
    "choice": ChoiceCtrl,
    // "multiChoice": MultipleChoiceCtrl,
    // "richChoice": RichChoiceCtrl,
    "bool": CheckboxCtrl,
    "file": FileCtrl,
    // "font": FontCtrl,
    // "survey": SurveyCtrl,
    // "fileList": FileListCtrl,
    // "table": TableCtrl,
    // "color": ColorCtrl,
    // "dict": DictCtrl,
    // "inv": InvalidCtrl
}