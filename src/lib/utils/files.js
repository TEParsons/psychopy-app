import path from "path-browserify";
import { electron } from "$lib/globals.svelte"

export async function browseFileOpen(
    filters=[]
) {
    let output
    if (electron) {
        // get file path from electron dialog
        let file = await electron.files.openDialog({
            properties: ["openFile"],
            filters: filters.map(
                item => {return {
                    name: item.description, 
                    extensions: Object.values(item.accept).flat().map(ext => ext.slice(1))
                }}
            ).concat([
                { name: "All Files", extensions: ["*"]}
            ])
        })
        // abort if no file
        if (file === undefined) {
            return
        }
        // populate current.file
        output = {
            name: path.basename(file[0]),
            file: file[0],
            handle: undefined
        }
    } else {
        // get file handle from system dialog
        let handle = await window.showOpenFilePicker({
            types: filters
        }).catch(err => undefined);
        // abort if no file
        if (handle === undefined) {
            return
        }
        // get file blob from handle
        let file = await handle[0].getFile();
        // populate current.file
        output = {
            name: file.name,
            file: file.name,
            handle: file
        }
    }

    return output
}