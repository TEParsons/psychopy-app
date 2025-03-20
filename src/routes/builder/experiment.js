

export class Experiment {
    /**
     *
     * @param {Document} document XML document to create an Experiment from
     */
    constructor(document) {
        // store xml document
        this.document = document;
        // get top level nodes
        let settings_node = this.document.getElementsByTagName("Settings")[0];
        let routines_node = this.document.getElementsByTagName("Routines")[0];
        let flow_node = this.document.getElementsByTagName("Flow")[0];
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
        // populate its params
        for (let param of node.getElementsByTagName("Param")) {
            let obj = new Param(
                param.getAttribute("val"),
                param.getAttribute("valType"),
                param.getAttribute("updates"),
                param.getAttribute("plugin")
            );
            parsed_node.params.set(
                param.getAttribute("name"),
                obj
            );
        }
        // return it
        return parsed_node;
    }


    /**
     * Display this Experiment as a JSON string
     */
    serialize() {
        return JSON.stringify(this, null, "\t");
    }
}
export class Routine {
    constructor(name, exp) {
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
}

export class StandaloneRoutine {
    constructor(exp, tag, name, plugin = null) {
        this.exp = this.exp;
        this.tag = tag;
        this.name = name;
        this.plugin = plugin;
        this.params = new Map();
    }
}

export class Component {
    constructor(tag, name, routine, plugin = null) {
        this.tag = tag;
        this.name = name;
        this.routine = routine;
        this.plugin = plugin;
        this.params = new Map();
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
}

export class Param {
    constructor(val, valType, updates, plugin = null) {
        this.val = val;
        this.valType = valType;
        this.updates = updates;
        this.plugin = plugin;
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
}

