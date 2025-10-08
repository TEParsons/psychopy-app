import ComponentProfiles from "$lib/experiment/components.json";
import LoopProfiles from "$lib/experiment/loops.json";
import DeviceProfiles from "$lib/experiment/devices.json";
import PreferencesProfile from "$lib/preferences.json";


export var componentProfiles = $state(ComponentProfiles);
export var loopProfiles = $state(LoopProfiles);
export var deviceProfiles = $state(DeviceProfiles);
export var preferencesProfile = $state(PreferencesProfile);