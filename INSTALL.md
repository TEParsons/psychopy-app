To install, navigate to this folder in terminal and then run:

```
cd svelte
npm i
cd ..
cd electron
npm i
cd ..
```

To run, navigate again to this folder in terminal and then run:
```
mprocs
```
First run will take longer as it needs to install Python packages - to install these manually, run:
```
cd electron
uv venv --python 3.10 --clear
uv pip install git+https://github.com/TEParsons/psychopy@dev-rf-app-optional
uv pip install -e ../pycompanion
```