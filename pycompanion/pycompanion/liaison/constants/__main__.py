import sys
import json
from . import constants


# when called as a module, print names to stdout as a JSON
sys.stdout.write(
    json.dumps({
        key: val for key, val in constants.__dict__.items() if not key.startswith("__")
    })
)