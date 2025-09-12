from argparse import ArgumentParser
from threading import Thread
from . import WebsocketLiaison


parser = ArgumentParser(
    prog="Websocket Liaison",
    description="For coordinating messaging over a websocket between an endpoint and a Companion insance",
    add_help=True
)
parser.add_argument(
    "address",
    type=str, 
    default="localhost:8001", 
    help=(
        "Address (<host>:<port>) to host the websocket server at"
    )
)

args = parser.parse_args()


# create and start a websocket liaison
WebsocketLiaison(
    *args.address.split(":")
).start()