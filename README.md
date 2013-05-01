coffee-script-mapped
====================

At the moment the coffee-script node.js module lacks proper support for stack-traces when compile coffeescript files.
This module adds the correct line and column indication in stack-traces for coffee-script modules loaded with require() or parsed using the coffeem command (which replaces coffee command).

to install :

`npm install coffee-script-mapped`

to run as a command line you can call `coffeem` (which works exactly as the coffee command, except it'll have proper stacktraces)

Notes:

* the "coffee-script-mapped" module exports the coffee-script module, so you can use it wherever you used the coffee-script module
* this module does not provide the "coffee-script" module, you need to provide it on you own (this is so that any version can be used)
* this module caches sourcemaps for all coffee-scripts, so it might create some overhead. 
* you can pass `--no-source-maps` to the node or coffeem commands to disable this module (which will revert to the standard coffee-script module)


License MIT:
http://opensource.org/licenses/MIT

Acknowledgments:
* part of this code was copied and modified from https://github.com/evanw/node-source-map-support 