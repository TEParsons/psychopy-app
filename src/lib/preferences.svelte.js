import { electron } from "$lib/globals.svelte";
import { HasParams } from "$lib/experiment/experiment.svelte";


class Preferences extends HasParams {
    ready = undefined;

    // object mapping only params relevant to keyboard shortcuts
    shortcuts = $derived(Object.fromEntries(
        Object.entries(this.params).filter(
            ([name, param]) => param.valType === "keypress")
        )
    )

    constructor() {
        // initialise superclass
        super("Preferences")
        // load prefs from file
        this.ready = this.load()
    }

    load() {
        return electron.paths.prefs()
            .then(
                // make sure prefs file exists
                async file => {
                    if (!(await electron.files.exists(file))) {
                        await this.save()
                    }

                    return file
                }
            ).then(
                // load data from file
                file => electron.files.load(file)
            ).then(
                // setup params from file content
                data => this.fromJSON(JSON.parse(data))
            )
    }

    save() {
        return electron.paths.prefs()
            .then(
                // save prefs to file
                file => electron.files.save(
                    // JSONify first
                    file, JSON.stringify(
                        this.toJSON(), undefined, 4
                    )
                )
            )
    }
}


export let prefs = new Preferences();

