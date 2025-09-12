import pytest
from pycompanion.liaison.websocket import WebsocketLiaison, send_message
from threading import Thread


class TestWebsocketLiaison:
    def setup_class(self):
        # create a websocket liaison
        self.liaison = WebsocketLiaison(
            host="localhost",
            port="8001"
        )
        # start it in a separate thread
        Thread(
            target=self.liaison.start,
            daemon=True
        ).start()
    
    def test_register(self):
        # register a module
        resp = send_message(
            self.liaison,
            message={
                "command": "register",
                "args": ["test_module", "tests.util.test_module"]
            }
        )
        assert resp
        assert "test_module" in self.liaison.companion.namespace
        from tests.util import test_module
        assert self.liaison.companion.namespace['test_module'] is test_module
        # register a class
        resp = send_message(
            self.liaison,
            message={
                "command": "register",
                "args": ["TestClass", "tests.util.test_module:TestClass"]
            }
        )
        assert resp
        assert "TestClass" in self.liaison.companion.namespace
        from tests.util.test_module import TestClass
        assert self.liaison.companion.namespace['TestClass'] is TestClass
        # register a function
        resp = send_message(
            self.liaison,
            message={
                "command": "register",
                "args": ["test_function", "tests.util.test_module:test_function"]
            }
        )
        assert resp
        assert "test_function" in self.liaison.companion.namespace
        from tests.util.test_module import test_function
        assert self.liaison.companion.namespace['test_function'] is test_function
        # register a constant
        resp = send_message(
            self.liaison,
            message={
                "command": "register",
                "args": ["TEST_CONSTANT", "tests.util.test_module:TEST_CONSTANT"]
            }
        )
        assert resp
        assert "TEST_CONSTANT" in self.liaison.companion.namespace
        from tests.util.test_module import TEST_CONSTANT
        assert self.liaison.companion.namespace['TEST_CONSTANT'] is TEST_CONSTANT
    
    def test_init(self):
        # register a class
        if "TestClass" not in self.liaison.companion.namespace:
            resp = send_message(
                self.liaison,
                message={
                    "command": "register",
                    "args": ["TestClass", "tests.util.test_module:TestClass"]
                }
            )
        # initialise it
        resp = send_message(
            self.liaison,
            message={
                "command": "init",
                "args": ["test_instance", "TestClass", "value"],
                "kwargs": {"test_kwarg": "value"}
            }
        )
        assert resp
        assert "test_instance" in self.liaison.companion.namespace
        from tests.util.test_module import TestClass
        assert isinstance(self.liaison.companion.namespace['test_instance'], TestClass)
    
    def test_store(self):
        # register an arbitrary value
        resp = send_message(
            self.liaison,
            message={
                "command": "store",
                "args": ["TestClass", "tests.util.test_module:TestClass"]
            }
        )
        # register a class
        if "TestClass" not in self.liaison.companion.namespace:
            send_message(
                self.liaison,
                message={
                    "command": "register",
                    "args": ["TestClass", "tests.util.test_module:TestClass"]
                }
            )
        # initialise it
        if "test_instance" not in self.liaison.companion.namespace:
            send_message(
                self.liaison,
                message={
                    "command": "init",
                    "args": ["test_instance", "TestClass", "value"],
                    "kwargs": {"test_kwarg": "value"}
                }
            )
        # check that value can be retrieved
        
    
    def test_get(self):
        # register a class
        if "TestClass" not in self.liaison.companion.namespace:
            send_message(
                self.liaison,
                message={
                    "command": "register",
                    "args": ["TestClass", "tests.util.test_module:TestClass"]
                }
            )
        # check that class can be got
        resp = send_message(
            self.liaison,
            message={
                "command": "get",
                "args": ["TestClass"]
            }
        )
        from tests.util.test_module import TestClass
        assert resp.startswith("<class 'tests.util.test_module.test_submodule.TestClass")
        # initialise it
        if "test_instance" not in self.liaison.companion.namespace:
            send_message(
                self.liaison,
                message={
                    "command": "init",
                    "args": ["test_instance", "TestClass", "value"],
                    "kwargs": {"test_kwarg": "value"}
                }
            )
        # check that instance can be got
        resp = send_message(
            self.liaison,
            message={
                "command": "get",
                "args": ["test_instance"]
            }
        )
        assert resp.startswith("<tests.util.test_module.test_submodule.TestClass")
        # check that attributes of instance can be got
        resp = send_message(
            self.liaison,
            message={
                "command": "get",
                "args": ["test_instance.test_attribute"]
            }
        )
        assert resp == "test"
        # check that imported constant can be got
        
    
    def teardown_class(self):
        # stop liaison when done
        self.liaison.stop()

        