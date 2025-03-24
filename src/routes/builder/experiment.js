import { writable } from "svelte/store";
// get component profiles from json file
import ComponentProfiles from "$lib/components.json"


export class Experiment {
    /**
     *
     * @param {String} filename Name of the experiment file
     * @param {Document} document XML document to create an Experiment from
     */
    constructor(filename, document) {
        // store filename
        this.filename = filename;
        // store xml document
        this.document = document;
        // get top level nodes
        let exp_node = this.document.getElementsByTagName("PsychoPy2experiment")[0];
        let settings_node = this.document.getElementsByTagName("Settings")[0];
        let routines_node = this.document.getElementsByTagName("Routines")[0];
        let flow_node = this.document.getElementsByTagName("Flow")[0];
        // get version
        this.version = exp_node.getAttribute("version");
        // get settings
        this.settings = this.parse_node(settings_node);
        // get routines
        this.routines = new Map();
        for (let rt of routines_node.childNodes) {
            let parsed_rt = this.parse_node(rt);
            if (parsed_rt === null) {
                continue;
            }
            this.routines.set(parsed_rt.name, parsed_rt);
        }
        // get loops
        this.loops = new Map();
        for (let initiator of flow_node.getElementsByTagName("LoopInitiator")) {
            let parsed_loop = this.parse_node(initiator);
            this.loops.set(parsed_loop.name, parsed_loop);
        }
        // get loop terminators
        for (let terminator of flow_node.getElementsByTagName("LoopTerminator")) {
            let parsed_terminator = this.parse_node(terminator);
            this.loops.get(parsed_terminator.name).terminator = parsed_terminator;
        }
        // construct flow
        this.flow = new Flow();
        let currentLoop = this.flow;
        for (let emt of flow_node.childNodes) {
            let parsed_emt = this.parse_node(emt);
            if (parsed_emt === null) {
                continue;
            }
            this.flow.flat.push(parsed_emt)
        }
        // update dynamic flow
        this.flow.dynamicize()
    }

    parse_node(node, parent) {
        let parsed_node;
        // if a Routine, call parse_node on all Components inside it
        if (node.nodeName === "Routine") {
            // make Routine
            parsed_node = new Routine(
                node.getAttribute("name"),
                this
            );
            // parse Components
            for (let comp of node.childNodes) {
                let obj = this.parse_node(comp, parsed_node);
                // skip none
                if (obj === null) {
                    continue;
                }
                // add to either components list or settings attribute
                if (comp.nodeName === "RoutineSettingsComponent") {
                    parsed_node.settings = obj;
                } else {
                    parsed_node.components.push(obj);
                }
            }
            // return now
            return parsed_node;
        }
        // if a LoopTerminator, make and return
        if (node.nodeName === "LoopTerminator") {
            // make LoopTerminator
            parsed_node = new LoopTerminator(
                this,
                node.getAttribute("name")
            );
            // return now
            return parsed_node;
        }
        // if a Component or StandaloneRoutine, parse each param
        if (node.nodeName === "Settings" || node.nodeName.endsWith("Component")) {
            // make Component
            parsed_node = new Component(
                node.nodeName, node.getAttribute("name"), parent, node.getAttribute("plugin")
            );
        } else if (node.nodeName.endsWith("Routine")) {
            // make StandaloneRoutine
            parsed_node = new StandaloneRoutine(
                this, node.nodeName, node.getAttribute("name"), node.getAttribute("plugin")
            );
        } else if (node.nodeName === "LoopInitiator") {
            // make LoopInitiator
            parsed_node = new LoopInitiator(
                this, node.getAttribute("loopType"), node.getAttribute("name")
            );
        } else {
            return null;
        }
        // get template for this object
        let profile = ComponentProfiles[parsed_node.tag]
        // create template params first
        if (profile !== undefined) {
            for (let key in profile.params) {
                let obj = new Param(
                    key, 
                    profile.params[key].val, 
                    profile.params[key].categ, 
                    profile.params[key].allowedVals, 
                    profile.params[key].valType, 
                    profile.params[key].inputType, 
                    profile.params[key].updates, 
                    profile.params[key].allowedUpdates, 
                    profile.params[key].label,
                    profile.params[key].hint,
                    profile.params[key].plugin,
                )
                parsed_node.params.set(key, obj);
            }
        }
        // populate its params
        for (let param of node.getElementsByTagName("Param")) {
            let name = param.getAttribute("name")
            // if param was templated, fill in variable attributes
            if (parsed_node.params.has(name)) {
                let template = parsed_node.params.get(name);
                param.name = param.getAttribute("val") || template.val
                param.name = param.getAttribute("valType") || template.valType
                param.name = param.getAttribute("updates") || template.updates
                param.name = param.getAttribute("plugin") || template.plugin
            } else {
                let obj = new Param(
                    name, 
                    param.getAttribute("val"), 
                    "Unknown", 
                    undefined, 
                    param.getAttribute("valType"), 
                    "inv", 
                    param.getAttribute("updates"), 
                    [], 
                    param.getAttribute("name"),
                    "Parameter not recognised",
                    param.getAttribute("plugin"),
                );
                parsed_node.params.set(name, obj);
            }
            
            
        }
        // return it
        return parsed_node;
    }

    /**
     * Get this experiment as a JSON string.
     */
    toJSON() {
        return JSON.stringify(this, null, "\t");
    }

    /**
     * Get this experiment as an XML string
     */
    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        let main = doc.createElement("PsychoPy2experiment")
        main.setAttribute("encoding", "utf-8")
        main.setAttribute("version", this.version)
        // let flow_node = doc.createElement("Flow");

        // create settings node
        let settingsNode = this.settings.toXML();
        settingsNode.removeAttribute("name")
        settingsNode.removeAttribute("plugin")
        main.appendChild(settingsNode)

        // create routines node
        let routinesNode = doc.createElement("Routines");
        for (let [name, routine] of [...this.routines]) {
            // get xml of each routine
            routinesNode.appendChild(
                routine.toXML()
            )
        }
        main.appendChild(routinesNode)

        // create flow node
        let flowNode = this.flow.toXML()
        main.appendChild(flowNode)

        return main
    }

    /**
     * Save this Experiment as a psyexp file
     */
    async save() {
        // get file handle from system dialog
        let handle = await window.showOpenFilePicker({
            types: [{
                description: "PsychoPy Experiments",
                accept: {
                    "application/xml": [".psyexp"]
                }
            }]
        });
        // get file blob from handle
        let file = await handle[0].getFile();
        // load xml
        let xml_parser = new DOMParser()
        let document = xml_parser.parseFromString(await file.text(), "application/xml");
        // construct an Experiment object from the file
        let exp = new Experiment(document)
    }
    
}
export class Routine {
    constructor(name, exp) {
        this.tag = "Routine";
        this.exp = exp;
        this.name = name;
        this.components = [];
        this.settings = undefined;
    }

    get visualStop() {
        let dur = 1;
        for (let comp of this.components) {
            if (comp.visualStop > dur) {
                dur = comp.visualStop;
            }
        }
        return dur;
    }

    get visualTicks() {
        // work out timeline increments based on routine duration
        let increment;
        if (this.visualStop < 2) {
            increment = 0.1;
        } else if (this.visualStop < 20) {
            increment = 1;
        } else if (this.visualStop < 200) {
            increment = 10;
        } else {
            increment = 100;
        }
        // work out duration to last increment
        let last_increment = Math.floor(this.visualStop / increment) * increment;
        // work out ticks for timeline grid
        var ticks = [];
        for (let tick = 0; tick < last_increment; tick += increment) {
            ticks.push({
                label: Math.round((tick + increment) * 100) / 100,
                proportion: 1
            })
        }
        // work out remainder for last section
        let remainder = (this.visualStop - last_increment) / increment;

        return {
            labels: ticks,
            remainder: remainder
        }
    }

    get index() {
        for (let i in this.exp.flow.flat) {
            if (this.exp.flow.flat[i] === this) {
                return i;
            }
        }
    }

    relocateComponent(fromIndex, toIndex) {
        // convert indices to int
        fromIndex = parseInt(fromIndex)
        toIndex = parseInt(toIndex)
        // if this changes the indices, adjust
        if (toIndex > fromIndex) {
            toIndex -= 1;
        }
        // if toIndex was -1, move to end
        if (toIndex < 0) {
            toIndex = this.components.length;
        }
        // pop component from array
        let emt = this.components[fromIndex]
        this.components = Array.prototype.concat(
            this.components.slice(0, fromIndex),
            this.components.slice(fromIndex+1)
        )
        // insert back in at new position
        this.components = Array.prototype.concat(
            this.components.slice(0, toIndex),
            emt,
            this.components.slice(toIndex),
        )
    }

    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement("Routine");
        node.setAttribute("name", this.name);
        // add settings
        node.appendChild(
            this.settings.toXML()
        )
        // add components
        for (let component of this.components) {
            node.appendChild(
                component.toXML()
            )
        }

        return node
    }
}

export class StandaloneRoutine {
    constructor(exp, tag, name, plugin = null) {
        this.exp = this.exp;
        this.tag = tag;
        this.name = name;
        this.plugin = plugin;
        this.params = new Map();
    }

    copyParams() {
        let params = new Map();
        for (let [name, param] of [...this.params]) {
            params.set(name, param.copy())
        }
        console.log(["COPIED", params])
        return params
    }

    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement(this.tag);
        node.setAttribute("name", this.name);
        node.setAttribute("plugin", this.plugin);
        // add params
        for (let [name, param] of [...this.params]) {
            node.appendChild(
                param.toXML()
            )
        }

        return node
    }
}

/**
 * 
 * @param {Map<string, Param>} params Parameters to sort
 * @returns Parameters sorted into categories
 */
export function sortParams(params) {
    let sorted = new Map();
    for (let [name, param] of [...params]) {
        // make sure we have an entry for this categ
        if (!sorted.has(param.categ)) {
            sorted.set(param.categ, new Map())
        }
        // add param
        sorted.get(param.categ).set(name, param)
    }

    return sorted
}

export class Component {
    constructor(tag, name, routine, plugin = null) {
        this.tag = tag;
        this.name = name;
        this.routine = routine;
        this.plugin = plugin;
        this.params = new Map();
    }

    copyParams() {
        let params = new Map();
        for (let [name, param] of [...this.params]) {
            params.set(name, param.copy())
        }

        return params
    }

    get visualStart() {
        // todo: get frame rate from exp
        let fr = 60;


        let start_secs = null;
        if (!this.params.has("startType") || !this.params.has("startVal")) {
            return start_secs;
        }
        let startType = this.params.get("startType").val;
        let startVal = parseFloat(this.params.get("startVal").val);

        if (startType === "time (s)") {
            start_secs = startVal;
        } else if (startType === "frames") {
            start_secs = startVal / fr;
        }

        return start_secs;
    }

    get visualStop() {
        // todo: get frame rate from exp
        let fr = 60;


        let stop_secs = null;
        if (!this.params.has("stopType") || !this.params.has("stopVal")) {
            return stop_secs;
        }
        let stopType = this.params.get("stopType").val;
        let stopVal = parseFloat(this.params.get("stopVal").val);

        if (stopType === "time (s)") {
            stop_secs = stopVal;
        } else if (stopType === "duration (s)") {
            stop_secs = this.visualStart + stopVal;
        } else if (stopType === "frames") {
            stop_secs = stopVal / fr;
        }
        // sub in null for NaN
        if (isNaN(stop_secs)) {
            stop_secs = null;
        }

        return stop_secs;
    }

    get visualColor() {
        if (this.disabled) {
            return "overlay";
        } else if (this.forceEnd) {
            return "quaternary";
        } else {
            return "secondary";
        }
    }

    get forceEnd() {
        let force_end = false;

        for (let attr of ["forceEndRoutine", "endRoutineOn", "forceEndRoutineOnPress"]) {
            if (this.params.has(attr)) {
                if ([
                    true, "true", "True", // alias of true
                    "any click", "correct click", "valid click", // mouse
                    "look at", "look away", // roi
                ].includes(this.params.get(attr).val)) {
                    force_end = true;
                }
            }
        }

        return force_end;
    }

    get index() {
        for (let i in this.routine.components) {
            if (this.routine.components[i] === this) {
                return i;
            }
        }
    }

    get disabled() {
        let disabled = false;

        if (this.params.has("disabled")) {
            if ([true, "true", "True"].includes(this.params.get("disabled").val)) {
                disabled = true;
            }
        }

        return disabled;
    }

    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement(this.tag);
        node.setAttribute("name", this.name);
        node.setAttribute("plugin", this.plugin);
        // add params
        for (let [name, param] of [...this.params]) {
            node.appendChild(
                param.toXML()
            )
        }

        return node
    }
}

export class Param {
    constructor(
        name, 
        val, 
        categ, 
        allowedVals, 
        valType, 
        inputType, 
        updates, 
        allowedUpdates, 
        label,
        hint,
        plugin = null,
    ) {
        this.name = name;
        this.val = val;
        this.categ = categ || "Unknown";
        this.allowedVals = allowedVals;
        this.valType = valType;
        this.inputType = inputType;
        this.updates = updates;
        this.allowedUpdates = allowedUpdates;
        this.label = label || name;
        this.hint = hint || name;
        this.plugin = plugin;
    }

    copy() {
        return new Param(
            this.name, 
            this.val, 
            this.categ, 
            this.allowedVals, 
            this.valType, 
            this.inputType, 
            this.updates, 
            this.allowedUpdates, 
            this.label,
            this.hint,
            this.plugin,
        )
    }

    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement("Param");
        // assign values
        node.setAttribute("val", this.val);
        node.setAttribute("valType", this.valType);
        node.setAttribute("updates", this.updates);
        node.setAttribute("name", this.name);
        node.setAttribute("val", this.val);
        node.setAttribute("plugin", this.plugin);

        return node
    }
}

export class Flow {
    constructor(exp) {
        this.exp;
        this.flat = [];
        this.dynamic = [];
    }

    flatten() {
        this.flat = [];
        for (let rt of this.dynamic) {
            if (rt instanceof FlowLoop) {
                this.flat.push(rt.initiator);
                for (let subrt of rt.flatten()) {
                    this.flat.push(subrt);
                }
                this.flat.push(rt.terminator);
            } else {
                this.flat.push(rt);
            }
        }
    }

    dynamicize() {
        // construct flow
        let currentLoop = this;
        this.dynamic = [];
        for (let rt of this.flat) {
            // iterate through a flattened flow
            if (rt instanceof LoopInitiator) {
                // create a loop when we get to an initiator
                let loop = new FlowLoop(
                    rt,
                    currentLoop
                );
                // add to the current loop
                if (currentLoop instanceof Flow) {
                    currentLoop.dynamic.push(loop)
                } else {
                    currentLoop.routines.push(loop)
                }
                currentLoop = loop;
            } else if (rt instanceof LoopTerminator) {
                // close current loop, if any
                if (currentLoop instanceof Flow) {
                    throw "Loop Terminator found with no matching Loop Initiator"
                } else {
                    currentLoop.terminator = rt;
                    currentLoop = currentLoop.parent;
                }
            } else {
                if (currentLoop instanceof Flow) {
                    currentLoop.dynamic.push(rt);
                } else {
                    currentLoop.routines.push(rt);
                }
            }
        }
    }

    relocateElement(fromIndex, toIndex) {
        // convert indices to int
        fromIndex = parseInt(fromIndex)
        toIndex = parseInt(toIndex)
        // if this changes the indices, adjust
        if (toIndex > fromIndex) {
            toIndex -= 1;
        }
        // if toIndex was -1, move to end
        if (toIndex < 0) {
            toIndex = this.flat.length;
        }
        // pop element from flat array
        let emt = this.flat[fromIndex]
        this.flat = Array.prototype.concat(
            this.flat.slice(0, fromIndex),
            this.flat.slice(fromIndex+1)
        )
        // insert back in at new position
        this.flat = Array.prototype.concat(
            this.flat.slice(0, toIndex),
            emt,
            this.flat.slice(toIndex),
        )
        // update dynamic array
        this.dynamicize();
    }

    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement("Flow");
        // iterate through flat contents
        for (let emt of this.flat) {
            if (emt instanceof Routine || emt instanceof StandaloneRoutine) {
                let subnode = doc.createElement(emt.tag)
                subnode.setAttribute("name", emt.name)
                node.appendChild(subnode)
            } else {
                node.appendChild(
                    emt.toXML()
                )
            }
        }

        return node
    }
}

export class FlowLoop {
    constructor(initiator, parent) {
        this.loopType = initiator.loopType;
        this.name = initiator.name;
        this.params = initiator.params;
        this.parent = parent;
        this.initiator = initiator;
        this.terminator = undefined;
        this.routines = [];
    }

    flatten() {
        let flat = [];
        for (let rt of this.routines) {
            if (rt instanceof FlowLoop) {
                flat.push(rt.initiator);
                for (let subrt of rt.flatten()) {
                    flat.push(subrt);
                }
                flat.push(rt.terminator);
            } else {
                flat.push(rt);
            }
        }

        return flat;
    }
}

export class LoopInitiator {
    constructor(exp, loopType, name) {
        this.exp = exp;
        this.loopType = loopType;
        this.name = name;
        this.params = new Map();
        this.terminator = undefined;
    }

    get index() {
        for (let i in this.exp.flow.flat) {
            if (this.exp.flow.flat[i] === this) {
                return i;
            }
        }
    }

    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement("LoopInitiator");
        node.setAttribute("loopType", this.loopType);
        node.setAttribute("name", this.name);
        // add params
        for (let [name, param] of [...this.params]) {
            node.appendChild(
                param.toXML()
            )
        }

        return node
    }
}

export class LoopTerminator {
    constructor(exp, name) {
        this.exp = exp;
        this.name = name;
    }

    get index() {
        for (let i in this.exp.flow.flat) {
            if (this.exp.flow.flat[i] === this) {
                return i;
            }
        }
    }

    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement("LoopTerminator");
        node.setAttribute("name", this.name);

        return node
    }
}

