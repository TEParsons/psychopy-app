from psychopy.experiment import getAllElements
from pathlib import Path
import json

# blank dict to store output in
profiles = {}
# append JSON of each element
for name, cls in getAllElements().items():
    profiles[name] = cls.getJSON()
# custom method to handle non-serializable values
def default(o):
    if isinstance(o, Path):
        return str(o)
    if callable(o):
        return o()
# save to json
with open("components.json", "w") as f:
    json.dump(
        profiles, f, indent=True, default=default
    )
