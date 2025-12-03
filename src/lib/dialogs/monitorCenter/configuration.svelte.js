import { Param } from "$lib/experiment"


export class MonitorConfiguration {
    params = $state({})

    constructor(monitor, name, date) {
        this.monitor = monitor
        this.name = name
        this.date = date
    }

    /**
     * @returns JSON object representing this element
     */
    toJSON() {
        return {
            calibDate: this.date,
            distance: this.params.distance.val,
            sizePix: String.prototype.split(this.params.sizePix, ",").map(val => String.prototype.trim(val)),
            width: this.params.width.val,
            usebits: this.params.usebits.val
        }
    }

    /**
     * Populate this element from a JSON object
     *
     * @param {Object} node JSON object representing this element
     */
    fromJSON(node) {
        // store date
        this.date = node.calibDate
        // setup param attributes for each param
        this.params.distance = new Param("distance")
        Object.assign(this.params.distance, {
            val: node.distance,
            updates: "constant",
            inputType: "single",
            valType: "code",
            label: "Screen distance (cm)",
            hint: "How far, in centimeters (cm), is the screen from the participant?"
        })
        this.params.sizePix = new Param("sizePix")
        Object.assign(this.params.sizePix, {
            val: node.sizePix,
            updates: "constant",
            inputType: "single",
            valType: "list",
            label: "Screen size (pix)",
            hint: "The dimensions of the screen in pixels"
        })
        this.params.width = new Param("width")
        Object.assign(this.params.width, {
            val: node.width,
            updates: "constant",
            inputType: "single",
            valType: "code",
            label: "Screen width (cm)",
            hint: "The width of the screen in cenimeters (cm)"
        })
        this.params.usebits = new Param("usebits")
        Object.assign(this.params.usebits, {
            val: node.usebits,
            updates: "constant",
            inputType: "bool",
            valType: "code",
            label: "Use bits++?",
            hint: "Whether to use a CRS Bits++ calibration tool"
        })
        
        // {
        //     "calibDate": 1722588709,
        //     "gamma": 1,
        //     "width": 30,
        //     "distance": 57,
        //     "notes": "default (not very useful) monitor",
        //     "psychopyVersion": "2024.3.0",
        //     "usebits": false,
        //     "gammaGrid": "[[0. 1. 1.]\n [0. 1. 1.]\n [0. 1. 1.]\n [0. 1. 1.]]",
        //     "linearizeMethod": 1,
        //     "sizePix": [
        //         1024,
        //         768
        //     ]
        // }
    }
}