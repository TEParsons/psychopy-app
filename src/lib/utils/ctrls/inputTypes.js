import {
    SingleLineCtrl,
    MultiLineCtrl,
    NameCtrl,
    ChoiceCtrl,
    BoolCtrl,
    FileCtrl,
    ColorCtrl,
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
    "color": ColorCtrl,
    // "dict": DictCtrl,
    // "inv": InvalidCtrl
}