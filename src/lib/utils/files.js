import path from "path-browserify";

export async function browseFileOpen(
    filters=[{ name: 'All Files', extensions: ["*"] }]
) {
    let output
    if (electron) {
        // get file path from electron dialog
        let file = await electron.files.openDialog({
            properties: ["openFile"],
            filters: filters
        })
        // abort if no file
        if (file === undefined) {
            return
        }
        // populate current.file
        output = {
            name: path.basename(file[0]),
            stem: path.basename(file[0], ".psyexp"),
            file: file[0],
            handle: undefined
        }
    } else {
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
        // populate current.file
        output = {
            name: file.name,
            stem: file.name.replace(".psyexp", ""),
            file: file,
            handle: file
        }
    }

    return output
}