# PsychoPy

[![PyPI version](https://img.shields.io/pypi/v/psychopy-app.svg)](https://pypi.python.org/pypi/PsychoPy-App)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](code-of-conduct.md)  

---

This is the wxPython application to support creating experiments in the PsychoPy library.

## History

- from its inception around 2004 until 2026 the code was 
- ![PsychoPy Studio](https://github.com/psychopy/psychopy-studio) : in 2025 the app was rewritten for Electron/web using the Svelte framework in JavaScript, which was first released in 2026. See the 
- in 2026 this code was moved to its own repository psychopy-app
- this wxPython application, now dubbed PsychoPy App, will continued to be supported for a short period but the expectation is that it will be fully replaced by 

## Motivations

The motivations of **creating this** app were about making it easier to get up and running with PsychoPy experiments. It reduced those barriers by:
- (around 2004-2005) packaging a Python interpreter and all the required dependencies into an app bundle that could be easily installed
- (around 2009) adding a graphical "Builder" interface to allow non programmers to get up and running as well (although this is now ![recommended interface for programmers as well](https://))

The motivations for **moving to JS/Electron/Svelte** (i.e. PsychoPy Studio):
- wxPython is big and can be hard to install (notably on Linux)
- unparalleled cross-platform support (wxPython was OK, but not this good)
- web UI frameworks just are the way of the future (note how many apps are now built on JS with Electron). That means those web UI frameworks are the best supported UI frameworks. Again wxPython was OK, but not this good!
- better independence of the app UI and the experiment library

## Contributions

To contribute, please fork the repository, hack in a feature branch, and send a pull request.  For more, see [CONTRIBUTING.md](CONTRIBUTING.md) and the developers documentation at [https://www.psychopy.org/developers](https://psychopy.org/developers)

## More information

* Homepage: https://www.psychopy.org
* Forum: https://discourse.psychopy.org