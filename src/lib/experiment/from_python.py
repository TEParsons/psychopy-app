import functools
import json
from pathlib import Path
from psychopy.experiment import Experiment, Param, getAllComponents
from psychopy.experiment.components import getAllComponents, BaseComponent
from psychopy.tools import stringtools


def py2str(obj):
    """
    Represent a Python function or class as an import string

    Parameters
    ----------
    obj : function or class
        Object to represent
    """
    # if given a partial, get wrapped function
    if isinstance(obj, functools.partial):
        obj = obj.func
    
    return f"python:///{obj.__module__}:{obj.__qualname__}"


def param2json(param:Param):
    output = {
        "$ref": "/Param",
        "title": param.label,
        "description": param.hint,
        "properties": {
            "val": {
                "default": param.val
            },
            "valType": {
                "default": param.valType
            },
            "inputType": {
                "default": param.inputType
            },
            "categ": {
                "default": param.categ
            },
            "updates": {
                "default": param.updates
            },
            "plugin": {
                "default": param.plugin
            }
        }
    }
    # add allowed updates, if any
    if param.allowedUpdates:
        # always allow set during
        output['properties']['updates']['oneOf'] = [{
            "title": "Set during...",
            "description": "Set at another point, e.g. during a Static Component",
            "pattern": "set during \\w*"
        }]
        # add extra options for allowed updates
        for update in param.allowedUpdates:
            if update == "constant":
                output['properties']['updates']['oneOf'].append({
                    "title": "Constant",
                    "description": "Value is set just the once",
                    "const": "constant"
                })
            if update == "set every repeat":
                output['properties']['updates']['oneOf'].append({
                    "title": "Set every repeat",
                    "description":"Value is set at the start of each Routine",
                    "const": "set every repeat"
                })
            if update == "set every frame":
                output['properties']['updates']['oneOf'].append({
                    "title": "Set every frame",
                    "description": "Value is set each frame",
                    "const": "set every frame"
                })
    # add allowed values (if iterable)
    if isinstance(param.allowedVals, (list, tuple)) and isinstance(param.allowedLabels, (list, tuple)):
        output['properties']['val']['oneOf'] = [
            {
                "title": label,
                "const": val
            }
            for val, label in zip(param.allowedVals, param.allowedLabels)
        ]
    # add allowed values (if callable)
    if callable(param.allowedVals) and callable(param.allowedLabels):
        output['properties']['val']['oneOf'] = [{
            "title": py2str(param.allowedLabels),
            "const": py2str(param.allowedVals)
        }]
    
    return output


def comp2json(comp:BaseComponent):
    output = {
        "$ref": "/Component",
        "title": stringtools.CaseSwitcher.pascal2title(comp.__class__.__name__),
        "description": comp.tooltip,
        "properties": {
            "__class__": {
                "default": py2str(comp.__class__)
            },
            "categories": {
                "default": comp.categories,
            },
            "targets": {
                "default": comp.targets
            },
            "plugin": {
                "default": comp.plugin
            },
            "icon": {
                "default": comp.__class__.__name__
            },
            "version": {
                "default": str(comp.version)
            },
            "beta": {
                "default": comp.beta
            },
            "validators": {
                "default": getattr(comp, "validatorClasses", [])
            },
            "hidden": {
                "default": comp.hidden
            },
            "params": {
                "type": "object",
                "properties": {}
            }
        }
    }
    # add params
    for name, param in comp.params.items():
        output['properties']['params']['properties'][name] = param2json(param)
    
    return output


exp = Experiment()
output = {}
for cls in getAllComponents().values():
    comp = cls(exp=exp, parentName="someroutine")
    output[cls.__name__] = comp2json(comp)

with open(Path(__file__).parent / "all_components.schema.json", "w") as f:
    json.dump(output, f, indent=4)

