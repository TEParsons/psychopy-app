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
    code: undefined
})


/**
 * Get the information for the current user as a catchable promise
 */
async function getUserInfo(token) {
    const resp = await fetch(`${auth.root}/api/v4/user?access_token=${token}`);
    if (resp.ok) {
        return await resp.json();
    } else {
        throw new Error(resp.statusText || 'Failed to get user info');
    }
}


/**
 * Uses the stored refresh token to refresh the stored access token
 */
async function refreshToken(username) {
    const resp = await fetch(
        `/api/token/refresh?${new URLSearchParams({
            root: auth.root,
            redirect: electron ? auth.root : window.location.href,
            client: auth.client,
            refresh: users[username].token.refresh,
            verifier: auth.verifier
        }).toString()}`,
        { method: "post" }
    );

    const data = await resp.json();

    if (data.access_token && data.refresh_token) {
        users[username].token.access = data.access_token;
        users[username].token.refresh = data.refresh_token;
        return data;
    } else {
        throw new Error(data.message || 'Token refresh failed');
    }
}


export async function login(username, current) {
    if (users[username]) {
        // if we have a stored access token, make sure it's in date
        if (users[username].token?.access) {
            // get info
            let profile = Promise.withResolvers()
            getUserInfo(
                `${users[username].token.access}`
            ).catch(
                async err => {
                    // if token has expired, refresh it
                    await refreshToken(username).catch(
                        err => profile.reject(err)
                    )
                    // then try again
                    getUserInfo(
                        `${users[username].token.access}`
                    ).catch(
                        suberr => profile.reject([suberr, err])
                    ).then(
                        resp => profile.resolve(resp)
                    )
                }
            ).then(
                resp => profile.resolve(resp)
            )
            // update profile on resolution
            profile.promise.then(
                resp => {
                    users[username].profile = resp
                }
            )
            await profile.promise
        }
    } else {
        // if logging in from scratch...
        // are we working with a code sent via URL?
        if (!auth.code) {
            // create a private "state" based on uuid
            auth.state = String(crypto.randomUUID())
            // first make the answer - pick random alphanumeric chars
            auth.verifier = Array.from(
                { length: randint(44, 127) },
                () => randof("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~")
            ).join("")
            // create a hash from verifier (via SHA-256 digestion)
            let hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(auth.verifier))
            // decode hash to make challenge
            auth.challenge = btoa(String.fromCharCode(...new Uint8Array(hash))).replace("=", "")
            // construct auth url params
            let params = new URLSearchParams({
                client_id: auth.client,
                redirect_uri: electron ? auth.root : window.location.href,
                response_type: "code",
                state: auth.state,
                code_challenge: auth.challenge,
                code_challenge_method: "S256"
            })
            // construct auth url
            let url = `${auth.root}/oauth/authorize?${params.toString()}`
            // open authentication url
            if (electron) {
                // get code once ready
                auth.code = await electron.authenticatePavlovia(url)
            } else {
                // if running in browser, open in *this* window
                // (will redirect and create a new authenticated instance of this webpage when done)
                navigate(url)
                // from here, the new instance will call login with a code
                return
            }
        }
        // request actual auth and refresh tokens
        let tokens = await fetch(
            `/api/token/authorize?${new URLSearchParams({
                root: auth.root,
                redirect: electron ? auth.root : window.location.href,
                client: auth.client,
                code: auth.code,
                verifier: auth.verifier
            }).toString()}`,
            { method: "post" }
        ).then(resp => resp.json())
        // discard code now we're done with it (so we can log in as different users later)
        auth.code = undefined
        // update profile
        let profile = await fetch(
            `${auth.root}/api/v4/user?access_token=${tokens.access_token}`
        ).then(resp => resp.json())
        // get username incase they logged in as a different user
        username = profile.username
        // create user
        if (username) {
            users[username] = {
                token: {
                    access: tokens.access_token,
                    refresh: tokens.refresh_token
                },
                profile: profile
            }
        } else {
            // if we failed to get a username, this function needs to fail so it can be caught
            throw new Error("Failed to login")
        }
    }
    // save users (if possible)
    if (electron) {
        await electron.paths.pavlovia.users().then(
            file => electron.files.save(file, JSON.stringify(users, undefined, 4))
        )
    }

    return username
}

export function logout() {
    // reset all auth params
    Object.assign(auth, {
        state: "",
        challenge: "",
        verifier: "",
        token: {
            code: undefined,
            refresh: undefined,
            access: undefined
        }
    })
}
