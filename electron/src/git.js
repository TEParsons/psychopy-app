import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import fs from "node:fs";


export async function sync(folder, user) {
    // get current branch
    let branch = await git.currentBranch({
        fs,
        dir: folder,
    })
    // get remote URL
    let remote = new URL(
        await git.getConfig({
            fs,
            dir: folder,
            path: "remote.origin.url"
        })
    )
    // apply auth
    remote.username = "oauth2"
    remote.password = user.token.access
    // fetch changes from remote
    await git.pull({
        fs,
        http,
        dir: folder,
        author: {
            name: user.profile.name,
            email: user.profile.email
        },
        onAuth: evt => { 
            return { username: "oauth2", password: user.token.access } 
        }
    })
    // stage all changes
    for (let file of fs.globSync("*", { cwd: folder })) {
        // skip if gitignored
        if (await git.isIgnored({
            fs, 
            dir: folder, 
            filepath: file
        })) {
            continue
        }
        // stage
        await git.add({
            fs, 
            dir: folder, 
            filepath: file
        })
    }
    // make commit
    let sha = await git.commit({
        fs,
        dir: folder,
        message: "Test commit",
        author: {
            name: user.profile.name,
            email: user.profile.email
        }
    })
    // push changes
    await git.push({
        fs,
        http,
        dir: folder,
        onAuth: evt => { 
            return {username: "oauth2", password: user.token.access} 
        }
    })

    return sha
}