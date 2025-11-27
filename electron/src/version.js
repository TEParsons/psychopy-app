import { app } from "electron";

export function parseVersion(version) {
    // split into year, minor and major
    let [year, major, minor] = version.split(".")
    // return as an object
    return {
        major: `${year}.${major}`,
        minor: minor
    }
}

export const appVersion = app.isPackaged ? parseVersion(app.getVersion()) : {major: "dev", minor: app.getVersion()};
