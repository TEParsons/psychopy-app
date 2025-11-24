export { default as UserCtrl } from "./UserCtrl.svelte";
export { default as ProjectCtrl } from "./ProjectCtrl.svelte";

import { randint, randof } from "$lib/utils/tools/random";
import { electron } from "$lib/globals.svelte";

export var users = $state({});
export var projects = $state({});

export async function loadProjects() {
    // no saved users if not in electron
    if (!electron) {
        return
    }
    // get file path
    let file = await electron.paths.pavlovia.projects();
    // get file contents
    let content = await electron.files.load(file);
    // parse JSON
    let data = JSON.parse(content);
    // apply
    Object.assign(users, data)

    return users
}

export var auth = $state({
    root: "https://gitlab.pavlovia.org",
    client: "944b87ee0e6b4f510881d6f6bc082f64c7bba17d305efdb829e6e0e7ed466b34",
    state: "",
    challenge: "",
    verifier: "",
    token: {
        type: "",
        token: ""
    }
})


export async function login() {
    // create a private "state" based on uuid
    auth.state = String(crypto.randomUUID())
    // first make the answer - pick random alphanumeric chars
    auth.verifier = Array.from(
        {length: randint(44, 127)},
        () => randof("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~")
    ).join("")
    // create a hash from verifier (via SHA-256 digestion)
    let hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(auth.verifier))
    // decode hash to make challenge
    auth.challenge = btoa(String.fromCharCode(...new Uint8Array(hash))).replace("=", "")
    // construct auth url params
    let params = new URLSearchParams({
        client_id: auth.client,
        redirect_uri: window.location.href,
        response_type: "code",
        state: auth.state,
        code_challenge: auth.challenge,
        code_challenge_method: "S256"
    })
    // open authentication url
    window.open(
        `${auth.root}/oauth/authorize?${params.toString()}`
    );
}

export function logout() {
    // reset all auth params
    Object.assign(auth, {
        state: "",
        challenge: "",
        verifier: "",
        token: "",
        refreshToken: ""
    })
}
