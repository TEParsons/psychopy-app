import { randint, randof } from "$lib/utils/tools/random";

export { default as PavloviaUsers } from "./users.json";
export { default as PavloviaProjects } from "./projects.json";

export var auth = $state({
    root: "https://gitlab.pavlovia.org/",
    redirect: "https://gitlab.pavlovia.org/",
    client: "944b87ee0e6b4f510881d6f6bc082f64c7bba17d305efdb829e6e0e7ed466b34",
    state: "",
    challenge: "",
    verifier: "",
    token: {
        type: "",
        token: ""
    }
})


export async function getAuthURL() {
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
    
    // construct auth url
    return (
        `${auth.root}/oauth/authorize?`
        + `client_id=${auth.client}`
        + `&redirect_uri=${auth.redirect}`
        + `&response_type=code`
        + `&state=${auth.state}`
        + `&code_challenge=${auth.challenge}`
        + `&code_challenge_method=S256`
    )
}

export async function login() {
    // open authentication url in a new tab
    let url = await getAuthURL();
    let win = window.open(url);
    // request the "code" param from that tab when ready
    let codeResp = win.postMessage({
        method: "POST",
        body: JSON.stringify({
            'client_id': auth.client, 
            'code': undefined,
            'grant_type': "authorization_code",
            'redirect_uri': auth.redirect,
            'code_verifier': auth.verifier
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    return
    // use that code to request an OAuth from pavlovia
    let authResp = await fetch("https://gitlab.pavlovia.org/oauth/token", {
        method: "POST",
        body: JSON.stringify({
            'client_id': auth.client,
            'code': codeResp.json()['code'],
            'grant_type': "authorization_code",
            'redirect_uri': auth.redirect,
            'code_verifier': auth.verifier
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    // store OAuth
    auth.token.type = authResp.json()['token_type']
    auth.token.token = authResp.json()['token']
}

export function logout() {
    // reset all auth params
    auth.state = ""
    auth.challenge = ""
    auth.verifier = ""
    auth.token.type = ""
    auth.token.token = ""
}