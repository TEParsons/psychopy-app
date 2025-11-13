import { app, BrowserWindow }  from 'electron';
import proc from "child_process";
import { platform , arch } from "process";
import logging from "./logging.js";
import path from "path";
import fs from "fs";
import extract from "extract-zip";
import appVersion from "./version.json" with { type: "json" };
import { python } from "./python.js"

let decoder = new TextDecoder();

/**
 * Execute a function with output sent to the front end
 */
async function execTracked(args) {
    // execute asynchronously
    let prog = proc.spawn(
        uv.executable,
        args
    )
    // pass output to front end
    prog.stdout.on("data", evt => uv.output(evt))
    prog.stderr.on("data", evt => uv.output(evt))
    // await completion/error
    let promise = Promise.withResolvers()
    prog.on("close", (code, signal) => promise.resolve([code, signal]))
    prog.on("error", err => promise.reject(err))

    return promise.promise
}

export async function installUV() {
    // make sure folder exists
    fs.mkdirSync(uv.dir, {
        recursive: true
    })
    // if installed, update
    if (uv.exists()) {
        // proc.execSync(`${uv.executable} self update`)
        return true
    }
    // map installers to system architectures
    let installers = {
        win32: {
            x64: "uv-x86_64-pc-windows-msvc.zip",
            x86: "uv-i686-pc-windows-msvc.zip",
            arm64: "uv-aarch64-pc-windows-msvc.zip",
        },
        darwin: {
            x64: "uv-x86_64-apple-darwin.tar.gz",
            arm64: "uv-aarch64-apple-darwin.tar.gz"
        },
        linux: {

        }
    }
    // get relevant executable 
    await fetch(
        `https://github.com/astral-sh/uv/releases/download/0.8.18/${installers[platform][arch]}`
    ).then(
        resp => resp.blob()
    ).then(
        async blob => {
            let zipfile = path.join(uv.dir, ".uv" + path.extname(installers[platform][arch]));
            // write zip file
            fs.writeFileSync(zipfile, await blob.bytes());
            // extract zip file
            await extract(zipfile, {
                dir: uv.dir
            })
            // delete zip file
            fs.unlink(zipfile, err => {if (err) throw err})
        }
    )
}

export function findPython(
    version={python: "3.10", psychopy: appVersion.major}, 
    folder=path.join(app.getPath("appData"), "psychopy4", ".python")
) {
    // make sure version has necessary keys
    version.python = version.python || "3.10"
    version.psychopy = version.psychopy || appVersion.major
    // get specific folder for this version
    folder = path.join(app.getPath("appData"), "psychopy4", ".python", version.psychopy)
    // try using UV to search for a Python executable
    try {
        return decoder.decode(
            proc.execSync(`"${uv.executable}" python find "${folder}"`)
        ).trim()
    } catch (err) {
        // if this fails, return undefined (as there is none)
        return
    }
}


export function installPython(
    version={python: "3.10", psychopy: appVersion.major}, 
    folder=path.join(app.getPath("appData"), "psychopy4", ".python")
) {
    // make sure version has necessary keys
    version.python = version.python || "3.10"
    version.psychopy = version.psychopy || appVersion.major
    // get specific folder for this version
    folder = path.join(app.getPath("appData"), "psychopy4", ".python", version.psychopy)
    // make sure folder exists
    fs.mkdirSync(folder, {
        recursive: true
    })
    // make a new venv
    proc.execSync(`"${uv.executable}" venv --python ${version.python} --clear "${folder}"`)
    // get executable
    python.details.executable = findPython()
    // install PsychoPy and liaison
    proc.execSync(`"${uv.executable}" pip install git+https://github.com/psychopy/liaison --python "${python.details.executable}"`)
    if (version.psychopy === "dev") {
        proc.execSync(`"${uv.executable}" pip install git+https://github.com/psychopy/psychopy-lib@dev --python "${python.details.executable}"`)
    } else {
        proc.execSync(`"${uv.executable}" pip install psychopy=="${version.psychopy}" --python "${python.details.executable}"`)
    }

    return true
}


export async function installPackage(name, executable) {
    // log start
    uv.output(
        `Installing ${name}...`
    )
    // install
    let resp = await execTracked(
        ["pip", "install", name, "--python", executable]
    )
    // log done
    uv.output(
        `Finished installing ${name}.`
    )

    return resp
}


export async function uninstallPackage(name, executable) {
    // log start
    uv.output(
        `Uninstalling ${name}...`
    )
    // uninstall
    let resp = await execTracked(
        ["pip", "uninstall", name, "--python", executable]
    )
    // log done
    uv.output(
        `Finished uninstalling ${name}.`
    )

    return resp
}


export function getPackages(executable) {
    // get package list from pip
    let resp = decoder.decode(
        proc.execSync(`"${uv.executable}" pip list --python "${executable}" --format json`)
    )
    // parse it
    let output = Object.fromEntries(
        JSON.parse(resp).map(val => [val.name, val.version])
    )

    return output
}


export async function getPackageDetails(name, executable) {
    // use pip show to get details
    let resp = decoder.decode(
        proc.execSync(`"${uv.executable}" pip show ${name} --python "${executable}"`)
    );
    // parse as an object
    let local = Object.fromEntries(
        resp.matchAll(/^(.*?): (.*?)$/gm).map(val => [val[1], val[2]])
    );
    // coerce to PyPi esque format
    let pypi = {
        info: {
            name: local.Name,
            version: local.Version,
            requires_dist: local.Requires
        },
        releases: {
            [local.Version]: []
        }
    }
    // get package from pypi if possible
    let online
    try {
        // request
        online = await fetch(`https://pypi.org/pypi/${name}/json`, { cache: "force-cache" }).then(resp => resp.json());
    } catch {
        // fail silently
        online = {}
    }
    // apply to existing info object
    Object.assign(pypi, online)

    return pypi
}


export function getEnvironments(
    folder=path.join(app.getPath("appData"), "psychopy4", ".python")
) {
    let output = {}
    // iterate through subfolders in the python folder
    for (let subfolder of fs.readdirSync(folder)) {
        let executable
        let ppyVersion
        try {
            // look for an executable in this folder
            executable = decoder.decode(
                proc.execSync(`"${uv.executable}" python find "${path.join(folder, subfolder)}"`)
            ).trim()
            // get version of PsychoPy
            ppyVersion = decoder.decode(
                proc.execSync(`"${uv.executable}" pip show psychopy --python "${executable}"`)
            ).match(/Version: (\d+\.\d+\.\d+)/)[1]
        } catch (err) {
            // skip if none found
            continue
        }
        // store
        output[subfolder] = {
            executable: executable,
            version: ppyVersion
        }
    }
    
    return output
}


export var uv = {
    dir: path.join(app.getPath("appData"), "psychopy4", ".uv"),
    executable: path.join(app.getPath("appData"), "psychopy4", ".uv", "uv"),
    output: (message) => {
        // if given a buffer, decode it
        if (message instanceof Buffer) {
            message = decoder.decode(message)
        }
        // log message
        logging.log(message, "UV")
        // emit event
        BrowserWindow.getAllWindows().forEach(
            win => win.webContents.send("uv", message)
        )
    },
    exists: () => fs.globSync("uv.*", {cwd: uv.dir}).length > 0,
    installUV: installUV,
    installPython: installPython,
    findPython: findPython,
    getEnvironments: getEnvironments,
    installPackage: installPackage,
    uninstallPackage: uninstallPackage,
    getPackages: getPackages,
    getPackageDetails: getPackageDetails,
}