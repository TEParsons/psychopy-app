import ComponentProfiles from "$lib/experiment/fallbacks/components.json";
import LoopProfiles from "$lib/experiment/fallbacks/loops.json";
import DeviceProfiles from "$lib/experiment/fallbacks/devices.json";
import PreferencesProfile from "$lib/preferences.json";


export var profiles = $state({
    components: ComponentProfiles,
    loops: LoopProfiles,
    devices: DeviceProfiles,
    preferences: PreferencesProfile
})