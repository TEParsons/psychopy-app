import fs from "fs";
import path from "path";
import { app } from "electron";


let decoder = new TextDecoder();
// choose where to save
let target = path.join(app.getPath("appData"), "psychopy4", "last_app_load.log");
// clear file
fs.writeFileSync(target, "")
// create writeable
let logfile = fs.createWriteStream(target, {flags : 'w'});

export function log(msg) {
    // if given a list, join
    if (typeof msg === "array") {
        msg = msg.join("\t")
    }
    // log to console
    console.log(msg)
    // stringify
    msg = String(msg)
    // make sure we have a newline
    if (!msg.endsWith("\n")) {
        msg += "\n"
    }
    // write to log file
    logfile.write(msg);
}

export default {
    log: log
}