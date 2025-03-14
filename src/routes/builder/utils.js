export class ExperimentFile {
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
        this.loops = new Map()
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
        this.flow = []
        for (let emt of flow_node.childNodes) {
            let parsed_emt = this.parse_node(emt);
            if (parsed_emt === null) {
                continue;
            }
            if (emt.nodeName === "LoopInitiator") {
                this.flow.push(this.loops.get(parsed_emt.name));
            } else if (emt.nodeName === "LoopTerminator") {
                this.flow.push(this.loops.get(parsed_emt.name).terminator);
            } else {
                this.flow.push(this.routines.get(parsed_emt.name));
            }
        }
    }

    parse_node(node) {
        let parsed_node
        // if a Routine, call parse_node on all Components inside it
        if (node.nodeName === "Routine") {
            // make Routine
            parsed_node = new Routine(
                node.getAttribute("name")
            );
            // parse Components
            for (let comp of node.childNodes) {
                parsed_node.components.push(
                    this.parse_node(comp)
                );
            }
            // return now
            return parsed_node;
        }
        // if a LoopTerminator, make and return
        if (node.nodeName === "LoopTerminator") {
            // make LoopTerminator
            parsed_node = new LoopTerminator(
                node.getAttribute("name")
            );
            // return now
            return parsed_node;
        }
        // if a Component or StandaloneRoutine, parse each param
        if (node.nodeName === "Settings" || node.nodeName.endsWith("Component")) {
            // make Component
            parsed_node = new Component(
                node.nodeName, node.getAttribute("name"), node.getAttribute("plugin")
            );
        } else if (node.nodeName.endsWith("Routine")) {
            // make StandaloneRoutine
            parsed_node = new StandaloneRoutine(
                node.nodeName, node.getAttribute("name"), node.getAttribute("plugin")
            );
        } else if (node.nodeName === "LoopInitiator") {
            // make LoopInitiator
            parsed_node = new LoopInitiator(
                node.getAttribute("loopType"), node.getAttribute("name")
            );
        } else {
            return null;
        }
        // populate its params
        for (let param of node.getElementsByTagName("Param")) {
            parsed_node.params.push(
                new Param(
                    param.getAttribute("val"), 
                    param.getAttribute("valType"), 
                    param.getAttribute("updates"), 
                    param.getAttribute("plugin")
                )
            )
        }
        // return it
        return parsed_node;
    }


    /**
     * Display this Experiment as a JSON string
     */
    serialize() {
        return JSON.stringify(this, null, "\t")
    }
}


export class Routine {
    constructor(name) {
        this.name = name;
        this.components = [];
    }
}


export class StandaloneRoutine {
    constructor(tag, name, plugin=null) {
        this.tag = tag;
        this.name = name;
        this.plugin = plugin;
        this.params = [];
    }
}


export class Component {
    constructor(tag, name, plugin=null) {
        this.tag = tag;
        this.name = name;
        this.plugin = plugin;
        this.params = [];
    }
}


export class Param {
    constructor(val, valType, updates, plugin=null) {
        this.val = val;
        this.valType = valType;
        this.updates = updates;
        this.plugin = plugin;
    }
}


export class LoopInitiator {
    constructor(loopType, name) {
        this.loopType = loopType;
        this.name = name;
        this.params = [];
        this.terminator = undefined;
    }
}


export class LoopTerminator {
    constructor(name) {
        this.name = name;
    }
}
