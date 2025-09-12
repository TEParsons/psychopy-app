import importlib
import re


RE_IMPORT_STRING = re.compile(
    r"^([\w\d_]+)(\.[\w\d_]+)*(:[\w\d_]+)?(\.[\w\d_]+)*$"
)
RE_RESOLVE_STRING = re.compile(
    r"^\$([\w\d_]+)(\.[\w\d_]+)*$"
)


class Companion:

    def __init__(self):
        # create a namespace to evaluate commands in
        self.namespace = {}
        # store own methods as named commands
        self.commands = {
            'get': self.resolve,
            'init': self.initialize,
            'run': self.call,
            'register': self.register,
            'store': self.store
        }
    
    @staticmethod
    def resolve_import(target):
        """
        Resolve an element from a valid import string (e.g. `numpy.random:randint`)

        Parameters
        ----------
        target : str
            A valid Python import string
        
        Returns
        -------
        any
            The imported element
        """
        # check that the import looks correct
        assert RE_IMPORT_STRING.fullmatch(target), (
            "Target '{}' does not look like a Python import."
        ).format(target)
        # get just module path
        if ":" in target:
            # if we have a :, extract the paths before and after it
            modstr, attrs = target.split(":", 1)
            # split attribute path at every .
            attrs = attrs.split(".")
        else:
            # otherwise, whole target is a module
            modstr = target
            attrs = []
        # import the module
        module = importlib.import_module(modstr)
        # drill down the attributes
        element = module
        for attr in attrs:
            element = getattr(element, attr)
        
        return element
    
    def actualize(self, arg):
        """
        Work out whether a value needs to be resolved and, if so, resolve it. If not, returns the 
        value unchanged.

        Parameters
        ----------
        arg : any
            Value to resolve
        """
        if isinstance(arg, str) and RE_RESOLVE_STRING.fullmatch(arg):
            return self.resolve(arg[1:])
        else:
            return arg
    
    def resolve(self, target):
        """
        Get the value from this Companion's namespace which a string points to.

        Parameters
        ----------
        target : str
            A string of attribute/key references starting with a name in this Companion's namespace
        """
        return eval(target, self.namespace)
    
    def initialize(self, name, cls, *args, **kwargs):
        """
        Initialize an object from a registered class and register it

        Parameters
        ----------
        name : str
            String to refer to the registered object by later.
        args : list
            Arguments to initialize the object with - each will be passed to `.actualize` first
        kwargs : dict
            Keyword arguments to initialize the object with - each key and value will be passed to 
            `.actualize` first

        Returns
        -------
        bool
            True if object was registered successfully
        """
        self.namespace[name] = self.call(
            cls,
            *args,
            **kwargs
        )

        return True
    
    def call(self, fcn, *args, **kwargs):
        """
        Call a registered function

        Parameters
        ----------
        fcn : str
            Resolvable path to the function
        args : list
            Arguments to call the function with - each will be passed to `.actualize` first
        kwargs : dict
            Keyword arguments to call the function with - each key and value will be passed to 
            `.actualize` first

        Returns
        -------
        any
            Output from the function
        """
        try:
            caller = self.resolve(fcn)
        except:
            try:
                caller = self.resolve_import(fcn)
            except:
                raise NameError(f"Could not find function {fcn}.")

        return caller(
            *[self.actualize(arg) for arg in args], 
            **{self.actualize(key): self.actualize(arg) for key, arg in kwargs.items()}
        )

    def register(self, name, target):
        """
        Register a class, method, instance or constant with this Companion, to be referred to later.

        Parameters
        ----------
        name : str
            String to refer to the registered object by later.
        target : str
            Import string pointing to the target object
        
        Returns
        -------
        bool
            True if object was registered successfully
        """
        # import element from target string
        element = self.resolve_import(target)
        # if no name given, try to use the element's name
        if name is None:
            if "__name__" in element:
                name = element.__name__
            else:
                # if no name given and element has no name, error
                raise AttributeError(
                    "Could not infer name from '{}' as value is not a named object".format(target)
                )
        # store in namespace
        self.namespace[name] = element
        
        return True
    
    def store(self, name, value):
        """
        Store an arbitrary value with this Component, to be referred to later.

        Parameters
        ----------
        name : str
            String to refer to the stored value by later
        value : str
            Value to store
        
        Returns
        -------
        bool
            True if value was stored successfully
        """
        self.namespace[name] = value
        
