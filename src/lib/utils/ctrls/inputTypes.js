import SingleLineCtrl from "./SingleLineCtrl.svelte";
import MultiLineCtrl from "./MultiLineCtrl.svelte";
import ChoiceCtrl from "./ChoiceCtrl.svelte";
import BoolCtrl from "./BoolCtrl.svelte";
import FileCtrl from "./FileCtrl.svelte";
import ColorCtrl from "./ColorCtrl.svelte";


export var mapping = {
    "single": SingleLineCtrl,
    "multi": MultiLineCtrl,
    "choice": ChoiceCtrl,
    // "multiChoice": MultipleChoiceCtrl,
    // "richChoice": RichChoiceCtrl,
    "bool": BoolCtrl,
    "file": FileCtrl,
    // "font": FontCtrl,
    // "survey": SurveyCtrl,
    // "fileList": FileListCtrl,
    // "table": TableCtrl,
    "color": ColorCtrl,
    // "dict": DictCtrl,
    // "inv": InvalidCtrl
}