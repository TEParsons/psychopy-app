import { app }  from 'electron';
import proc from "child_process";
import { platform , arch } from "process";
import path from "path";
import fs from "fs";
import extract from "extract-zip";
import { fileURLToPath } from 'url';

let decoder = new TextDecoder();


let __dirname = path.dirname(fileURLToPath(import.meta.url))


export var uv = {
    dir: path.join(app.getPath("appData"), "psychopy4", ".uv"),
    executable: path.join(app.getPath("appData"), "psychopy4", ".uv", "uv"),
}


export async function installUV() {
    // make sure folder exists
    fs.mkdirSync(uv.dir, {
        recursive: true
    })
    // if installed, update
    if (fs.existsSync(uv.executable)) {
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
            let zipfile = path.join(uv.dir, ".uv.zip");
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

    return uv.executable
}


export function installPython(version="3.10", folder=path.join(app.getPath("appData"), "psychopy4", ".venvs", "2025.2")) {
    // make sure folder exists
    fs.mkdirSync(folder, {
        recursive: true
    })
    // try to find executable
    let executable
    try { 
        executable = decoder.decode(
            proc.execSync(`"${uv.executable}" python find "${folder}"`)
        ).trim()
    } catch (err) {
        // install python if none found
        console.log("No Python venv found for this version, installing...")
        // make a new venv
        proc.execSync(`"${uv.executable}" venv --python ${version} --clear "${folder}"`)
        // get executable
        executable = decoder.decode(
            proc.execSync(`"${uv.executable}" python find "${folder}"`)
        ).trim()
        // install PsychoPy and pycompanion
        proc.execSync(`"${uv.executable}" pip install f:/GitHub/psychopy --python "${executable}"`)
        // proc.execSync(`"${uv.executable}" pip install git+https://github.com/psychopy/psychopy@dev --python "${executable}"`)
        proc.execSync(`"${uv.executable}" pip install ../pycompanion[websocket] --python "${executable}"`)
    }
    
    return executable
}