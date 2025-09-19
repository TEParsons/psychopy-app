import proc from "child_process";
import { platform , arch } from "process";
import path from "path";
import fs from "fs";
import extract from "extract-zip";
import { fileURLToPath } from 'url';

let decoder = new TextDecoder();


let __dirname = path.dirname(fileURLToPath(import.meta.url))


async function installUV() {
    // if installed, return now
    if (fs.existsSync(path.join(".", "uv", "uv"))) {
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
            let zipfile = path.join(".", ".uv.zip");
            // write zip file
            fs.writeFileSync(zipfile, await blob.bytes());
            // extract zip file
            await extract(zipfile, {
                dir: path.join(path.dirname(__dirname), ".uv")
            })
            // delete zip file
            fs.unlink(zipfile, err => {if (err) throw err})
        }
    )
}


export var uv = {
    install: installUV,
    dir: path.join(".", ".uv"),
    executable: path.join(".", ".uv", "uv"),
}

export async function installPython(version="3.10") {
    await uv.install()

    // use uv to make a venv
    proc.execSync(`${uv.executable} venv --python ${version} --clear`)
    // get executable path
    let executable = decoder.decode(
        proc.execSync(`${uv.executable} python find ${version}`)
    ).trim()
    // install PsychoPy and pycompanion
    proc.execSync(`${uv.executable} pip install git+https://github.com/psychopy/psychopy@dev --python ${executable}`)
    proc.execSync(`${uv.executable} pip install -e ../pycompanion --python ${executable}`)

    return executable
}