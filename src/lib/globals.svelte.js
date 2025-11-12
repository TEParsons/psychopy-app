// if running from electron, these will be set by preload.js, otherwise will be undefined
export var electron = $state(window.electron) 
export var python = $state(window.python)
// mark as ready once liaison loads
if (python) {
    python.onready(
        evt => python.ready = true
    )
}

export var devices = $state({})
export var projects = $state({})
export var users = $state({})