// get component profiles from json file
import ComponentProfiles from "$lib/components.json"


export class Experiment {

    version = "2026.1.0"

    routines = $state({})
    loops = $state({})
    filename = $state(null)

    /** store past and future states for this experiment */
    history = $state({
        past: [],
        future: [],
        update: () => {
            // store experiment state
            this.history.past.push(
                this.toJSON()
            )
            // limit to 16 items to save memory
            while (this.history.past.length >= 16) {
                delete this.history.past[0]
                this.history.past = this.history.past.slice(1);
            }
            // clear future
            this.history.future = []
        },
        clear: () => {
            // clear arrays for past and future
            this.history.past = []
            this.history.future = []
        },
        undo: () => {
            // do nothing if we have no past
            if (!this.history.past) {
                return
            }
            // store present as future
            this.history.future.unshift(
                this.toJSON()
            )
            // restore last state
            this.fromJSON(
                this.history.past.pop()
            )
        },
        redo: () => {
            // do nothin if we have no future
            if (!this.history.future) {
                return
            }
            // add current state to past
            this.history.past.push(
                this.toJSON()
            )
            // restore next state
            this.fromJSON(
                this.history.future.shift()
            )
        }
    })

    /**
     *
     * @param {String} filename Name of the experiment file
     */
    constructor(filename) {
        // create attributes
        this.settings = new Component("SettingsComponent")
        this.flow = new Flow(this);
        // starting defaults
        this.reset()
        // set filename
        this.filename = filename;
    }

    /**
     * Reset this Experiment as if from new
     */
    reset() {
        // set filename to untitled
        this.filename = "untitled.psyexp"
        // set to current version
        this.version = "2026.1.0"
        // clear history
        this.history.clear()
        // reset settings
        this.settings.reset()
        // remove all routines
        Object.keys(this.routines).forEach((key) => delete this.routines[key])
        // clear the flow
        this.flow.clear()
        // add a default routine
        let trial = new Routine();
        trial.exp = this;
        trial.name = "trial";
        this.routines['trial'] = trial
        this.flow.flat.push(trial)
        // 
    }

    pilotMode = $derived(this.settings.params['runMode'].val)

    /**
     * Get this Experiment as a JSON string.
     */
    toJSON() {
        // create node
        let node = {
            filename: this.filename,
            version: this.version,
            settings: this.settings.toJSON(),
            routines: {},
            flow: this.flow.toJSON(),
        };
        // add routines
        for (let [name, routine] of Object.entries(this.routines)) {
            node.routines[name] = routine.toJSON()
        }
        
        return node
    }

    /**
     * Populate this Experiment from a JSON object
     * 
     * @param {Object} node JSON object representing this Experiment
     */
    fromJSON(node) {
        // set basic attributes
        this.filename = node.filename;
        this.version = node.version;
        // copy settings
        this.settings.fromJSON(node.settings);
        // clear routines
        Object.keys(this.routines).forEach(key => delete this.routines[key])
        // add each routine from JSON
        for (let [name, profile] of Object.entries(node.routines)) {
            // make a new routine
            let rt = new Routine();
            rt.exp = this;
            // populate it from JSON
            rt.fromJSON(profile)
            // append it
            this.routines[name] = rt
        }
        // populate flow from JSON
        this.flow.fromJSON(node.flow)
    }

    /**
     * Populate this Experiment from an XML element
     * 
     * @param {String} filename Name of the experiment file
     * @param {Element} node XML element to create the Experiment from
     */
    fromXML(filename, node) {
        // store filename
        this.filename = filename
        // get version
        this.version = node.getAttribute("version");
        // get settings
        this.settings.fromXML(
            node.getElementsByTagName("Settings")[0]
        );
        // clear routines
        Object.keys(this.routines).forEach(key => delete this.routines[key])
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
                routine = new Routine(); 
            } else {
                routine = new StandaloneRoutine();
            }
            routine.exp = this;
            routine.fromXML(routineNode);
            // parse and append node
            this.routines[routine.name] = routine
        }
        // get flow
        this.flow.fromXML(
            node.getElementsByTagName("Flow")[0]
        );
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
        for (let [name, routine] of Object.entries(this.routines)) {
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
    components = $state([])

    visualStop = $derived.by(() => {
        let dur = 1;
        for (let comp of this.components) {
            if (comp.visualStop > dur) {
                dur = comp.visualStop;
            }
        }
        
        return dur;
    })

    visualTicks = $derived.by(() => {
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
    })

    constructor() {
        this.tag = "Routine";
        this.exp = undefined;
        // placeholder settings
        this.settings = new Component("RoutineSettingsComponent");
    }

    get name() {
        return this.settings.params['name'].val
    }

    set name(value) {
        if (this.exp !== undefined) {
            // relocate in routines map
            delete this.exp.routines[this.name]
            this.exp.routines[value] = this
        }
        // set in settings
        this.settings.params['name'].val = value;
    }

    addComponent(comp) {
        // add to Components array
        this.components.push(comp);
        // add reference to self
        comp.routine = this;
    }

    insertComponent(comp, index) {
        // convert index to int
        index = parseInt(index)
        // if toIndex was -1, move to end
        if (index < 0) {
            index = this.components.length;
        }
        // insert
        this.components.splice(
            index, 0, comp
        )
        // add reference to self
        comp.routine = this;
    }

    removeComponent(comp) {
        // remove from Components array
        let i = this.components.indexOf(comp)
        this.components = Array.prototype.concat(
            this.components.slice(0, i),
            this.components.slice(i+1)
        )
        // remove reference to self
        comp.routine = undefined;
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

    /**
     * Get this Routine as a JSON string.
     */
    toJSON() {
        // create node
        let node = {
            tag: this.tag,
            name: this.name,
            settings: this.settings.toJSON(),
            components: [],
        };
        // add routines
        for (let component of this.components) {
            node.components.push(component.toJSON())
        }

        return node
    }

    /**
     * Populate this Routine from a JSON
     * 
     * @param {Object} node JSON object to populate from
     */
    fromJSON(node) {
        // clear Components
        Object.keys(this.components).forEach(key => delete this.components[key])
        // populate settings
        this.settings.fromJSON(node.settings)
        // populate components
        for (let compNode of node.components) {
            // new component
            let comp = new Component(compNode.nodeName)
            // populate
            comp.fromJSON(compNode)
            // append
            this.addComponent(comp)
        }
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

    fromXML(node) {
        // parse details
        this.name = node.getAttribute("name")
        // parse Components
        for (let compNode of node.childNodes) {
            // skip blank nodes
            if (compNode instanceof Text) {
                continue
            }
            // parse node
            let comp = new Component(compNode.nodeName);
            comp.routine = this;
            comp.fromXML(compNode);
            // add to either components list or settings attribute
            if (comp.tag === "RoutineSettingsComponent") {
                this.settings = comp;
            } else {
                this.components.push(comp);
            }
        }
    }
}


export class Param {

    val = $state();
    updates = $state();

    // attributes which are saved to XML/JSON
    saveAttrs = [
        "name", 
        "val", 
        "valType", 
        "updates", 
        "plugin"
    ];

    constructor(name) {
        this.name = name;
        this.categ = undefined;
        this.allowedVals = undefined;
        this.valType = undefined;
        this.inputType = undefined;
        this.allowedUpdates = undefined;
        this.label = undefined;
        this.hint = undefined;
        this.plugin = undefined;
    }

    /**
     * @returns {HTMLElement} This Param as an XML node
     */
    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement("Param");
        // populate node
        for (let key of this.saveAttrs) {
            node.setAttribute(key, this[key]);
        }

        return node
    }

    /**
     * Set this Param's values from a JSON object
     * 
     * @param {HTMLElement} node This Param as an XML node
     */
    fromXML(node) {
        // populate
        for (let key of this.saveAttrs) {
            // set from XML if possible
            this[key] = node.getAttribute(key) || this[key]
        }
    }

    /**
     * @returns {object} This Param as a JSON object
     */
    toJSON() {
        // create node
        let node = {}
        // populate node
        for (let key of this.saveAttrs) {
            node[key] = this[key]
        }

        return node
    }

    /**
     * Set this Param's values from a JSON object
     * 
     * @param {object} node This Param as a JSON object
     */
    fromJSON(node) {
        // populate
        for (let key of this.saveAttrs) {
            // set from JSON if possible
            this[key] = node[key] || this[key]
        }
    }

    /**
     * @param {String} name Name of the param to create
     * 
     * @returns {Param} An unknown param
     */
    static makeUnknown(name) {
        // make param
        let param = new Param(name);
        // populate with standard unknown loadout
        Object.apply(param, {
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
        })

        return param
    }

    copy() {
        // create new param
        let dupe = new Param(this.name)
        // set attributes
        for (let key of Object.keys(this)) {
            dupe[key] = this[key]
        }

        return dupe
    }
}


export class HasParams {

    /** @attribute @type {String} Tag describing what kind of element this is (e.g. ImageComponent) */
    tag = undefined;

    /** @attribute @type {String|undefined} Name of the plugin (if any) which this element comes from */
    plugin = undefined;

    /**
     * Array of parameters for this element
     */
    params = $state({})

    /**
     * Name of this element
     */
    name = $derived.by(() => {
        if ("name" in this.params) {
            return this.params['name'].val
        }
    })

    /**
     * Whether this element is disabled
     */
    disabled = $derived(this.params['disabled'] && [true, "true", "True"].includes(this.params['disabled'].val))

    /**
     * This object's parameters, sorted by category
     */
    sortedParams = $derived.by(() => {
        // blank object
        let sorted = {};
        // iterate through params
        for (let [name, param] of Object.entries(this.params)) {
            // make sure we have an entry for this categ
            if (!(param.categ in sorted)) {
                sorted[param.categ] = {}
            }
            // add param
            sorted[param.categ][name] = param
        }

        return sorted
    })

    /**
     * Parameters relating to this element's start time
     */
    startParams = $derived({
        valueParam: this.params["startVal"],
        typeParam: this.params["startType"],
        expectedParam: this.params["startEstim"],
    })

    /**
     * Parameters relating to this element's stop time
     */
    stopParams = $derived.by(() => {
        // start off with no params
        let found = {
            valueParam: null,
            typeParam: null,
            expectedParam: null,
        }
        // get whatever params we can
        if ("stopVal" in this.params) {
            found.valueParam = this.params["stopVal"]
        }
        if ("stopType" in this.params) {
            found.typeParam = this.params["stopType"]
        }
        if ("durationEstim" in this.params) {
            found.expectedParam = this.params["durationEstim"]
        }

        return found
    })

    constructor(tag) {
        // store tag
        this.tag = tag === "Settings" ? "SettingsComponent" : tag;
        // start off blank
        this.reset()
    }

    /**
     * Reset this elements parameters to a template
     */
    reset() {
        // get template
        let template
        if (this.tag in ComponentProfiles) {
            template = ComponentProfiles[this.tag]
        } else {
            console.warn(
                `Failed to find template for ${this.tag}, reverting to UnknownComponent`
            )
            template = ComponentProfiles["UnknownComponent"]
        }
        // set plugin
        this.plugin = template.plugin;
        // clear params
        Object.keys(this.params).forEach((key) => delete this.params[key])
        // iterate through params in relevant template
        for (let [name, profile] of Object.entries(
            template.params || {}
        )) {
            // create a new param from template
            this.params[name] = new Param(name);
            // set attributes
            for (let [key, val] of Object.entries(profile)) {
                this.params[name][key] = val;
            }
        }
    }

    /**
     * Make a copy of this element's parameters
     */
    copyParams() {
        return $inspect(this.params)
    }

    /**
     * @returns {HTMLElement} XML node representing this element
     */
    toXML() {
        // create document
        let doc = document.implementation.createDocument(null, "xml");
        // create node
        let node = doc.createElement(
            this.tag === "SettingsComponent" ? "Settings" : this.tag
        );
        // set name and plugin
        node.setAttribute("name", this.name);
        node.setAttribute("plugin", this.plugin);
        // add params
        for (let param of Object.values(this.params)) {
            node.appendChild(
                param.toXML()
            );
        }

        return node
    }

    /**
     * Populate this element from an XML node
     * 
     * @param {Object} node JSON object representing this element
     */
    fromXML(node) {
        // set plugin from node
        this.plugin = node.getAttribute("plugin")
        // iterate through param nodes
        for (let paramNode of node.getElementsByTagName("Param")) {
            // param name
            let name = paramNode.getAttribute("name")
            // if param wasn't templated, make an unknown
            if (!(name in this.params)) {
                this.params[name] = Param.makeUnknown(name)
            }
            // populate param from XML
            this.params[name].fromXML(paramNode)
        }
    }

    /**
     * @returns JSON object representing this element
     */
    toJSON() {
        // make node with basic attributes
        let node = {
            tag: this.tag,
            plugin: this.plugin,
            params: {}
        }
        // add params
        for (let [name, param] of Object.entries(this.params)) {
            node.params[name] = param.toJSON();
        }

        return node
    }

    /**
     * Populate this element from a JSON object
     * 
     * @param {Object} node JSON object representing this element
     */
    fromJSON(node) {
        // set plugin and tag
        this.tag = node.tag
        this.plugin = node.plugin
        // iterate through param nodes
        for (let [name, paramNode] of Object.entries(node.params)) {
            // if param wasn't templated, make an unknown
            if (!(name in this.params)) {
                this.params[name] = Param.makeUnknown(name)
            }
            // populate param from JSON
            this.params[name].fromJSON(paramNode)
        }
    }
}


export class Component extends HasParams {
    constructor(tag) {
        super(tag)
        this.routine = undefined;
        this.exp = undefined;
    }

    /**
     * Numeric index within this Component's Routine
     */
    index = $derived(
        this.routine.components.findIndex((element) => element === this)
    )

    /**
     * Start time to display on the Routine canvas
     */
    visualStart = $derived.by(() => {
        // todo: get frame rate from exp
        let fr = 60;
        // if we don't have the necessary params, return null
        if (!("startType" in this.params) || !("startVal" in this.params)) {
            return null;
        }
        // get start val and type
        let startType = this.params['startType'].val;
        let startVal = parseFloat(this.params['startVal'].val);
        // work out seconds from start type and val
        let start_secs = null;
        if (startType === "time (s)") {
            start_secs = startVal;
        } else if (startType === "frames") {
            start_secs = startVal / fr;
        }
        // sub in null for NaN
        if (isNaN(start_secs)) {
            start_secs = null;
        }

        return start_secs;
    })

    /**
     * Stop time to display on the Routine canvas
     */
    visualStop = $derived.by(() => {
        // todo: get frame rate from exp
        let fr = 60;
        // if we don't have the necessary params, return null
        if (!("stopType" in this.params) || !("stopVal" in this.params)) {
            return null;
        }
        // get stop type and val
        let stopType = this.params['stopType'].val;
        let stopVal = parseFloat(this.params['stopVal'].val);
        // work out seconds from stop type and val
        let stop_secs = null;
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
    })

    /**
     * Color of this Component on the Routine canvas
     */
    visualColor = $derived.by(() => {
        if (this.disabled) {
            return "overlay";
        } else if (this.forceEnd) {
            return "orange";
        } else {
            return "blue";
        }
    })

    /**
     * Can this Component end the Routine?
     */
    forceEnd = $derived.by(() => {
        let force_end = false;

        for (let attr of ["forceEndRoutine", "endRoutineOn", "forceEndRoutineOnPress"]) {
            if (attr in this.params) {
                if ([
                    true, "true", "True", // alias of true
                    "any click", "correct click", "valid click", // mouse
                    "look at", "look away", // roi
                ].includes(this.params[attr].val)) {
                    force_end = true;
                }
            }
        }

        return force_end;
    })
}


export class StandaloneRoutine extends HasParams {
    constructor(tag) {
        super(tag)
        this.tag = tag;
        this.exp = undefined;
    }

    get index() {
        for (let i in this.exp.flow.flat) {
            if (this.exp.flow.flat[i] === this) {
                return i;
            }
        }
    }
}

export class Flow {

    flat = $state([])
    dynamic = $derived.by(() => {
        // construct flow
        let dynamic = [];
        let currentLoop = this;
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
                    dynamic.push(loop)
                } else {
                    currentLoop.routines.push(loop)
                }
                // set as the current loop (only if terminated)
                if (rt.complete) {
                    currentLoop = loop;
                }
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
                    dynamic.push(rt);
                } else {
                    currentLoop.routines.push(rt);
                }
            }
        }

        return dynamic;
    })
    
    constructor(exp) {
        this.exp = exp;
    }

    /**
     * Remove all items from the flow
     */
    clear() {
        this.flat.length = 0
    }

    removeElement(index) {
        // convert index to int
        index = parseInt(index)
        // pop from flat array
        this.flat.splice(index, 1)
    }

    relocateElement(element, toIndex) {
        // get element index
        let fromIndex = this.flat.indexOf(element)
        // convert indices to int
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
        this.flat.splice(
            fromIndex, 1
        )
        // insert back in at new position
        this.flat.splice(
            toIndex, 0, element
        )
    }

    insertElement(element, index) {
        // convert index to int
        index = parseInt(index)
        // if toIndex was -1, move to end
        if (index < 0) {
            index = this.flat.length;
        }
        // insert
        this.flat.splice(
            index, 0, element
        )
    }

    toJSON() {
        let node = []
        // iterate through items
        for (let item of this.flat) {
            // for Routines, just add name as they're defined elsewhere
            if (item instanceof Routine || item instanceof StandaloneRoutine) {
                node.push({ref: item.name})
                continue
            }
            // anything else, use its JSON method
            node.push(item.toJSON())
        }

        return node
    }

    fromJSON(node) {
        // clear self
        this.clear()
        // object to reference initiators as they're created
        let initiators = {}
        // iterate through items in node
        for (let profile of node) {
            // if profile is a ref to an extant object, get it
            if ("ref" in profile && profile.ref in this.exp.routines) {
                this.flat.push(
                    this.exp.routines[profile.ref]
                );
                continue
            } else if ("ref" in profile) {
                // if profile is a ref to a non-existent object, error
                throw Error(`Reference to nonexistant Routine ${profile.ref} in flow`)
            }
            // if profile is a loop initiator, recreate it
            if (LoopInitiator.tags.includes(profile.tag)) {
                // recreate
                let element = new LoopInitiator(profile.tag);
                element.exp = this.exp;
                element.fromJSON(profile)
                // add to flow
                this.flat.push(element);
                // store handle
                initiators[element.name] = element;
            }
            // if profile is a loop terminator, recreate it and link initiator
            if (profile.tag === "LoopTerminator") {
                // error if initiator doesn't exist
                if (!(profile.name in initiators)) {
                    console.log(initiators)
                    throw Error(`Reference to nonexistant LoopInitiator ${profile.name} in LoopTerminator`)
                }
                // recreate
                initiators[profile.name].addTerminator()
                // add to flow
                this.flat.push(
                    initiators[profile.name].terminator
                )
            }
        }
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

    fromXML(node) {
        // clear self
        this.clear();
        // object to reference initiators as they're created
        let initiators = {}
        // iterate through items in node
        for (let elementNode of node.childNodes) {
            if (elementNode instanceof Text) {
                continue
            }
            let name = elementNode.getAttribute("name");
            // if node is a loop initiator, recreate it
            if (elementNode.nodeName === "LoopInitiator") {
                // recreate
                let element = new LoopInitiator(
                    elementNode.getAttribute("loopType")
                );
                element.exp = this.exp;
                element.fromXML(elementNode)
                // add to flow
                this.flat.push(element);
                // store handle
                initiators[name] = element;
            } else if (elementNode.nodeName === "LoopTerminator") {
                // error if initiator doesn't exist
                if (!(name in initiators)) {
                    console.log(initiators)
                    throw Error(`Reference to nonexistant LoopInitiator ${name} in LoopTerminator`)
                }
                // recreate
                initiators[name].addTerminator()
                // add to flow
                this.flat.push(
                    initiators[name].terminator
                )
            } else {
                if (name in this.exp.routines) {
                    this.flat.push(
                        this.exp.routines[name]
                    );
                    continue
                } else {
                    // if profile is a ref to a non-existent object, error
                    throw Error(`Reference to nonexistant Routine ${name} in flow`)
                }
            }
        }
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

    get complete() {
        return this.terminator !== undefined
    }

    flatten() {
        let flat = [];
        for (let rt of this.routines) {
            if (rt instanceof FlowLoop) {
                flat.push(rt.initiator);
                for (let subrt of rt.flatten()) {
                    flat.push(subrt);
                }
                if (this.terminator !== undefined) {
                    flat.push(rt.terminator);
                }
            } else {
                flat.push(rt);
            }
        }

        return flat;
    }
}

export class LoopInitiator extends HasParams {

    loopType = $derived(() => this.params['loopType'].val)
    // tags which are known to correspond to a LoopInitiator
    static tags = [
        "TrialHandler"
    ]

    constructor(tag) {
        super(tag)
        this.exp = undefined;
        this.terminator = undefined;
    }

    get index() {
        for (let i in this.exp.flow.flat) {
            if (this.exp.flow.flat[i] === this) {
                return i;
            }
        }
    }

    get complete() {
        return this.terminator !== undefined;
    }

    addTerminator() {
        this.terminator = new LoopTerminator();
        this.terminator.name = this.name;
        this.terminator.exp = this.exp;
        this.terminator.initiator = this;
    }

    toXML() {
        // get node via parent method
        let node = super.toXML()
        // create a new node with the correct tag
        let newNode = node.ownerDocument.createElement("LoopInitiator")
        // copy inner content
        newNode.innerHTML = node.innerHTML
        // copy attributes
        for (let attr of node.attributes) {
            newNode.setAttribute(attr.name, attr.value)
        }
        // put tag in loopType instead
        newNode.setAttribute("loopType", this.tag);

        return newNode
    }
}

export class LoopTerminator {
    constructor() {
        this.exp = undefined;
        this.name = undefined;
        this.initiator = undefined;
    }

    get index() {
        for (let i in this.exp.flow.flat) {
            if (this.exp.flow.flat[i] === this) {
                return i;
            }
        }
    }

    /**
     * Get this Component as a JSON string.
     */
    toJSON() {
        // create node
        let node = {
            tag: "LoopTerminator",
            name: this.name,
        };

        return node
    }

    /**
     * Create a new Experiment from a JSON object
     * 
     * @param {Object} node 
     */
    static fromJSON(node) {
        // create a blank LoopInitiator
        let loop = new LoopTerminator();
        // populate settings
        loop.name = node.name

        return loop
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

