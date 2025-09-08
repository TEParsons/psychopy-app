export var python = $state(window.liaison) // if running from electron, this will be set by preload.js, otherwise will be undefined

export var devices = $state({})
export var projects = $state({})
export var users = $state({})