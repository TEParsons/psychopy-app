import { python } from "$lib/globals.svelte";


/**
 * Iterate a name by +1 (e.g. "field_1" becomes "field_2")
 * 
 * @param name Name to be iterated
 */
export function iterateName(name) {
    if (name.match(/\d+$/)) {
        // if name ends with a number, iterate it
        return name.replace(
            /(\d+$)/,
            (num) => String(
                parseInt(num) + 1
            )
        )
    } else {
        // otherwise, add a number
        return name + "_1"
    }
    
}

/**
 * Get an object mapping options from a parameter
 * 
 * @param param Param to get options for
 */
export function optionsFromParam(param) {
        let output = {};
        // if either allowed labels or values are a Python function, execute it
        if (typeof param.allowedVals === "string" && param.allowedVals.startsWith("python:///")) {
            if (python) {

            } else {
                // placeholder: no options to ctrl is disabled
                param.allowedVals = []
            }
        }
        if (typeof param.allowedLabels === "string" && param.allowedLabels.startsWith("python:///")) {
            if (python) {

            } else {
                // placeholder: no options to ctrl is disabled
                param.allowedLabels = []
            }
        }
        // if no allowed labels, use allowed values
        if (param.allowedLabels === undefined || param.allowedLabels.length == 0) {
            param.allowedLabels = param.allowedVals;
        }
        // if no allowed values, use allowed labels
        if (param.allowedVals === undefined || param.allowedVals.length == 0) {
            param.allowedVals = param.allowedLabels;
        }
        // if no allowed values or labels, there's no options
        if (!param.allowedVals && !param.allowedLabels) {
            return output;
        }
        // add allowed vals & labels to options
        for (let i in param.allowedVals) {
            output[param.allowedVals[i]] = param.allowedLabels[i];
        }
        
        return output
    }