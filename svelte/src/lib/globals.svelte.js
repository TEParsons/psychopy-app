export var electron = $state(window.electron) // if running from electron, this will be set by preload.js, otherwise will be undefined

export var devices = $state({})
export var projects = $state({})
export var users = $state({})