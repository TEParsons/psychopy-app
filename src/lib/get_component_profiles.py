from psychopy.experiment import getAllElements, loops
from pathlib import Path
import json

# blank dict to store output in
profiles = {}
# append JSON of each element
for name, cls in getAllElements().items():
    profiles[name] = cls.getJSON()
# append JSON of each loop type
for cls in loops._BaseLoopHandler.__subclasses__():
    profiles[cls.__name__] = cls.getJSON()
# custom method to handle non-serializable values
def default(o):
    if isinstance(o, Path):
        return str(o)
    if callable(o):
        return o()
# save to json
print((Path(__file__).parent / "components.json").absolute())
with (Path(__file__).parent / "components.json").open("w") as f:
    json.dump(
        profiles, f, indent=True, default=default
    )
