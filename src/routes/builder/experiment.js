import { writable } from "svelte/store";
// get component profiles from json file
import ComponentProfiles from "$lib/components.json"


export class Experiment {
    /**
     *
     * @param {String} filename Name of the experiment file
     * @param {Document} document XML document to create an Experiment from
     */
    constructor(filename) {
        // store filename
        this.filename = filename;
        // create attributes
        this.version = undefined;
        this.settings = new Component("SettingsComponent")
        this.routines = new Map();
        this.loops = new Map();
        this.flow = new Flow();
        // placeholder Routine
        let trial = new Routine();
        trial.exp = this;
        trial.name = "trial";
        this.routines.set(
            "trial", trial
        )
        this.flow.flat.push(trial)
        this.flow.dynamicize()
    }

    /**
     * Get the current pilot mode from Experiment Settings
     */
    get pilotMode() {
        // make sure there is a runMode param
        if (!this.settings.params.has("runMode")) {
            this.settings.params.set(
                "runMode", 
                Param.fromTemplate("SettingsComponent", "runMode")
            )
        }
        // get the relevant param
        let param = this.settings.params.get("runMode")
        // if 1, then we are in pilot mode
        return param.val === "0"
    }

    /**
     * Set the pilot mode in Experiment Settings
     */
    set pilotMode(val) {
        // make sure there is a runMode param
        if (!this.settings.params.has("runMode")) {
            this.settings.params.set(
                "runMode", 
                Param.fromTemplate("SettingsComponent", "runMode")
            )
        }
        // get the relevant param
        let param = this.settings.params.get("runMode")
        // set param value
        if (val) {
            param.val = "0";
        } else {
            param.val = "1";
        }
    }

    /**
     * Get this experiment as a JSON string.
     */
    toJSON() {
        return JSON.stringify(this, null, "\t");
    }

    /**
     * Populate this experiment from an XML element
     */
    static fromXML(filename, node) {
        // create blank experiment
        let exp = new Experiment(filename)
        // get version
        exp.version = node.getAttribute("version");
        // get settings
        let settingsNode = node.getElementsByTagName("Settings")[0];
        exp.settings = Component.fromXML(settingsNode);
        // get routines
        let routinesNode = node.getElementsByTagName("Routines")[0];
        for (let routineNode of routinesNode.childNodes) {
            // skip blank nodes
            if (routineNode instanceof Text) {
                continue
            }
            // parse node
            let routine;
            if (routineNode.nodeName === "Routine") {
                routine = Routine.fromXML(routineNode);
            } else {
                routine = StandaloneRoutine.fromXML(routineNode);
            }
            routine.exp = exp;
            // parse and append node
            exp.routines.set(
                routineNode.getAttribute("name"),
                routine
            )
        }
        // get flow
        let flowNode = node.getElementsByTagName("Flow")[0];
        for (let elementNode of flowNode.childNodes) {
            // skip blank nodes
            if (elementNode instanceof Text) {
                continue
            }
            // parse node
            let element;
            if (elementNode.nodeName === "LoopInitiator") {
                // create initiator object
                element = LoopInitiator.fromXML(elementNode)
                element.exp = exp;
                // store in loops array
                exp.loops.set(element.name, element)
            } else if (elementNode.nodeName === "LoopTerminator") {
                // create and use a terminator object
                element = LoopTerminator.fromXML(elementNode)
                element.exp = exp;
                // store reference in initiator
                exp.loops.get(element.name).terminator = element
            } else {
                // get from routines
                element = exp.routines.get(elementNode.getAttribute("name"))
            }
            // append node
            exp.flow.flat.push(element)
        }
        // dynamicise flow
        exp.flow.dynamicize()

        console.log(`Loaded experiment ${filename}:`, exp);

        return exp
    }

    /**
     * Get this experiment as an XML element
     */
    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        let main = doc.createElement("PsychoPy2experiment");
        main.setAttribute("encoding", "utf-8");
        main.setAttribute("version", this.version);

        // create settings node
        let settingsNode = this.settings.toXML();
        settingsNode.removeAttribute("name");
        settingsNode.removeAttribute("plugin");
        main.appendChild(settingsNode);

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
    constructor() {
        this.tag = "Routine";
        this.exp = undefined;
        this.name = undefined;
        this.components = [];
        // placeholder settings
        this.settings = Component.fromTemplate("RoutineSettingsComponent");
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

    static fromXML(node) {
        let routine = new Routine();
        // parse details
        routine.name = node.getAttribute("name")
        // parse Components
        for (let compNode of node.childNodes) {
            // skip blank nodes
            if (compNode instanceof Text) {
                continue
            }
            // parse node
            let comp = Component.fromXML(compNode);
            comp.routine = routine;
            // add to either components list or settings attribute
            if (comp.tag === "RoutineSettingsComponent") {
                routine.settings = comp;
            } else {
                routine.components.push(comp);
            }
        }

        return routine
    }
}

export class StandaloneRoutine {
    constructor(tag) {
        this.tag = tag;
        this.name = undefined;
        this.exp = undefined;
        this.plugin = undefined;
        this.params = new Map();
    }

    copyParams() {
        let params = new Map();
        for (let [name, param] of [...this.params]) {
            params.set(name, param.copy())
        }
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

    static fromXML(node) {
        // get tag from node
        let tag = node.nodeName;
        // create from template
        let comp = StandaloneRoutine.fromTemplate(tag);
        // populate info
        comp.name = node.getAttribute("name");
        comp.plugin = node.getAttribute("plugin") || comp.plugin;
        // populate params
        for (let paramNode of node.getElementsByTagName("Param")) {
            // get param name
            let name = paramNode.getAttribute("name")
            // get param template (from comp or a new template)
            let paramTemplate;
            if (comp.params.has(name)) {
                paramTemplate = comp.params.get(name)
            } else {
                paramTemplate = Param.fromTemplate(comp.tag, name)
            }
            // create param from xml
            let param = Param.fromXML(paramNode, paramTemplate)
            // store param
            comp.params.set(name, param)
        }
        
        return comp
    }

    static fromTemplate(tag) {
        // make a blank Component
        let comp = new StandaloneRoutine(tag);
        // get profile template
        let profile = ComponentProfiles[tag];
        // set plugin
        comp.plugin = profile.plugin;
        // populate params
        for (let key in profile.params) {
            comp.params.set(key, Param.fromTemplate(tag, key));
        }

        return comp
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
export function unsortParams(sorted) {
    let unsorted = new Map();
    // iterate through categories
    for (let [categ, params] of [...sorted]) {
        // iterate through params in category
        for (let [name, param] of [...params]) {
            // add param to flat array
            unsorted.set(name, param);
        }
    }

    return unsorted;
}

export class Component {
    constructor(tag) {
        this.tag = tag;
        this.name = undefined;
        this.routine = undefined;
        this.plugin = undefined;
        this.params = new Map();
    }

    static fromXML(node) {
        // get tag from node
        let tag = node.nodeName;
        if (tag === "Settings") {
            tag += "Component"
        }
        // create from template
        let comp = Component.fromTemplate(tag);
        // populate info
        comp.name = node.getAttribute("name")
        comp.plugin = node.getAttribute("plugin") || comp.plugin
        // populate params
        for (let paramNode of node.getElementsByTagName("Param")) {
            // get param name
            let name = paramNode.getAttribute("name")
            // get param template (from comp or a new template)
            let paramTemplate;
            if (comp.params.has(name)) {
                paramTemplate = comp.params.get(name)
            } else {
                paramTemplate = Param.fromTemplate(comp.tag, name)
            }
            // create param from xml
            let param = Param.fromXML(paramNode, paramTemplate)
            // store param
            comp.params.set(name, param)
        }
        
        return comp
    }

    static fromTemplate(tag) {
        // make a blank Component
        let comp = new Component(tag);
        // get profile template
        let profile = ComponentProfiles[tag];
        // set plugin
        comp.plugin = profile.plugin;
        // populate params
        for (let key in profile.params) {
            comp.params.set(key, Param.fromTemplate(tag, key));
        }

        return comp
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
        // get tag
        let tag
        if (this.tag === "SettingsComponent") {
            tag = "Settings"
        } else {
            tag = this.tag
        }
        // create node
        let node = doc.createElement(tag);
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
    constructor(name) {
        this.name = name;
        this.val = undefined;
        this.categ = undefined;
        this.allowedVals = undefined;
        this.valType = undefined;
        this.inputType = undefined;
        this.updates = undefined;
        this.allowedUpdates = undefined;
        this.label = undefined;
        this.hint = undefined;
        this.plugin = undefined;
    }

    static fromTemplate(comp, name) {
        // make a blank param
        let param = new Param(name);
        // get profile template
        let profile;
        if (comp in ComponentProfiles) {
            if (name in ComponentProfiles[comp].params) {
                profile = ComponentProfiles[comp].params[name]
            }
        }
        // if not templated, make an unknown param template
        if (profile === undefined) {
            profile = {
                val: undefined,
                categ: "Unknown",
                allowedVals: undefined,
                valType: undefined,
                inputType: "inv",
                updates: undefined,
                allowedUpdates: undefined,
                label: name,
                hint: "Parameter not recognised",
                plugin: undefined
            }
        }
        // set info from template
        for (let [key, value] of Object.entries(profile)) {
            param[key] = value;
        }

        return param
    }

    static fromXML(node, template) {
        // copy template as new param
        let param = template.copy();
        // populate info from node
        param.name = node.getAttribute("name") || template.name
        param.val = node.getAttribute("val") || template.val
        param.valType = node.getAttribute("valType") || template.valType
        param.updates = node.getAttribute("updates") || template.updates
        param.plugin = node.getAttribute("plugin") || template.plugin

        return param
    }

    copy() {
        // create new param
        let dupe = new Param(this.name)
        // set attributes
        dupe.val = this.val
        dupe.categ = this.categ
        dupe.allowedVals = this.allowedVals
        dupe.valType = this.valType
        dupe.inputType = this.inputType
        dupe.updates = this.updates
        dupe.allowedUpdates = this.allowedUpdates
        dupe.label = this.label
        dupe.hint = this.hint
        dupe.plugin = this.plugin

        return dupe
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
    constructor() {
        this.exp = undefined;
        this.loopType = undefined;
        this.name = undefined;
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

    static fromXML(node) {
        // create blank LoopInitiator
        let initiator = LoopInitiator.fromTemplate(
            node.getAttribute("loopType")
        )
        // populate info
        initiator.name = node.getAttribute("name")
        // populate params
        for (let paramNode of node.getElementsByTagName("Param")) {
            // get param name
            let name = paramNode.getAttribute("name")
            // get param template (from comp or a new template)
            let paramTemplate;
            if (initiator.params.has(name)) {
                paramTemplate = initiator.params.get(name)
            } else {
                paramTemplate = Param.fromTemplate(initiator.loopType, name)
            }
            // create param from xml
            let param = Param.fromXML(paramNode, paramTemplate)
            // store param
            initiator.params.set(name, param)
        }

        return initiator
    }

    static fromTemplate(tag) {
        // make a blank Component
        let initiator = new LoopInitiator();
        initiator.loopType = tag;
        // get profile template
        let profile = ComponentProfiles[tag];
        // set plugin
        initiator.plugin = profile.plugin;
        // populate params
        for (let key in profile.params) {
            initiator.params.set(key, Param.fromTemplate(tag, key));
        }

        return initiator
    }
}

export class LoopTerminator {
    constructor() {
        this.exp = undefined;
        this.name = undefined;
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

    static fromXML(node) {
        // make blank Loopterminator
        let terminator = new LoopTerminator();
        // populate info
        terminator.name = node.getAttribute("name");

        return terminator
    }
}

