from psychopy.experiment import getAllElements, loops, devices

from pathlib import Path
import json


# custom method to handle non-serializable values
def default(o):
    if isinstance(o, Path):
        return str(o)
    if callable(o):
        return o()

# blank dict to store output in
profiles = {}
# append JSON of each element
for name, cls in getAllElements().items():
    profiles[name] = cls.getJSON()

# save to json
with (Path(__file__).parent / "components.json").open("w") as f:
    json.dump(
        profiles, f, indent=True, default=default
    )

# also get loops
profiles = {}
# append JSON of each loop type
for cls in loops._BaseLoopHandler.__subclasses__():
    profiles[cls.__name__] = cls.getJSON()
# save to json
with (Path(__file__).parent / "loops.json").open("w") as f:
    json.dump(
        profiles, f, indent=True, default=default
    )

# also get devices
profiles = {}
# append JSON of each loop type
for cls in devices.DeviceBackend.__subclasses__():
    profiles[cls.__name__] = cls.getJSON()
    profiles[cls.__name__]['params']['name'] = profiles[cls.__name__]['params'].pop('deviceLabel')
# save to json
with (Path(__file__).parent / "devices.json").open("w") as f:
    json.dump(
        profiles, f, indent=True, default=default
    )