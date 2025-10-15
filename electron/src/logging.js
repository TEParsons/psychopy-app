import fs from "fs";
import path from "path";
import { app } from "electron";

/**
 * Handles text buffers
 */
export let decoder = new TextDecoder();


/**
 * Targets which can be logged to
 */
export var targets = {}


/**
 * Setup a file for logging to
 * 
 * @param {*} name Name to refer to this file by
 * @param {*} file File path to log to
 */
export function initialize(name, file) {
    // store file path
    targets[name] = {
        file: file
    }
    // clear file
    fs.writeFileSync(file, "")
    // create writeable
    targets[name].stream = fs.createWriteStream(file, {flags : 'w'});
}


/**
 * Log to a named target
 * 
 * @param {*} msg Message to log
 * @param {*} target Target (by name) to log to, if not given will log to general logfile
 * @param {*} tag Optional tag to prepend to the message (e.g. SENT, RECEIVED, ERROR, etc.)
 */
export function log(msg, tag=undefined, target="lastAppLoad") {
    if (typeof msg === "array") {
        // if given a list, join
        msg = msg.join("\t")
    } else if (typeof msg === "object") {
        // if given an object, stringify
        msg = JSON.stringify(msg)
    } else if (msg instanceof Buffer) {
        // if given a buffer, decode it
        decoder.decode(msg)
    } else {
        // anything else, convert to String
        msg = String(msg)
    }
    // prepend tag, if any
    if (tag) {
        msg = `${tag}\t${msg}`
    }
    // log to console
    console.log(
        msg.length > 100 ? `${msg.slice(0, 50)}...${msg.slice(-50)}` : msg
    )
    // make sure we have a newline
    if (!msg.endsWith("\n")) {
        msg += "\n"
    }
    // write to log file
    targets[target].stream.write(msg);
}

/**
 * Calls `log`, with "ERROR" supplied as the tag
 */
export function error(msg, target="lastAppLoad") {
    log(msg, "ERROR", target)
}


// initialize logging for liaison and general
initialize("lastAppLoad", path.join(app.getPath("appData"), "psychopy4", "last_app_load.log"))
initialize("liaison", path.join(app.getPath("appData"), "psychopy4", "liaison.log"))


export default {
    log: log,
    error: error,
    initialize: initialize,
    targets: targets,
    decoder: decoder
}