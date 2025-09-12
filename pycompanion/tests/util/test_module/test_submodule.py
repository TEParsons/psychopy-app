class TestClass:
    test_attribute = "test"
    
    def __init__(self, test_arg, test_kwarg="test"):
        self.test_arg = test_arg
        self.test_kwarg = test_kwarg
    
    def test_method(self, test_arg, test_kwarg="test"):
        return (test_arg, test_arg)


def test_function(test_arg, test_kwarg="test"):
    return (test_arg, test_arg)


TEST_CONSTANT = "test"
