# To install

Install UV to handle Python environments:
https://docs.astral.sh/uv/getting-started/installation

Install Node.js:
https://nodejs.org/en/download/

Install NPM dependencies for the svelte side of things:
```
cd svelte
npm i
cd ..
```

Install NPM dependencies for the electron side of things:
```
cd electron
npm i
cd ..
```

Setup a Python environment:
```
cd electron
uv venv --python 3.10 --clear
uv pip install git+https://github.com/psychopy/psychopy@dev
uv pip install -e ../pycompanion
cd ..
```

# To run

If you have mprocs installed and added to path, you can just call:

```
mprocs
```

Otherwise, you'll need to create two terminals. In one, call:

```
cd svelte
npm run dev
```

...and in the other, call:

```
cd electron
npm start
```