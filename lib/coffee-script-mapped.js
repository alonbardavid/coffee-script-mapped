var coffee = require("coffee-script");
var sourceMapSupport = require("./source-map-support");
var fs = require("fs")
_ref = ['.coffee', '.litcoffee', '.coffee.md'];
var sourceMaps = {};
var noSourceMaps = process.argv.indexOf("--no-source-maps") >=0

if (!noSourceMaps) {
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ext = _ref[_i];
        require.extensions[ext] = function (module, fileName) {
            var raw, stripped, answer;
            raw = fs.readFileSync(fileName, 'utf8');
            stripped = raw.charCodeAt(0) === 0xFEFF ? raw.substring(1) : raw;
            try {
                answer = coffee.compile(stripped, {
                    filename: fileName,
                    sourceFiles: [fileName],
                    literate: /\.(litcoffee|coffee\.md)$/.test(fileName),
                    sourceMap: true
                });
            } catch (err) {
                err._compile_err = true;
                err._mapped_data = {
                    filePath: fileName,
                    code:stripped 
                }
                throw err;
            }
            sourceMaps[fileName] = answer.v3SourceMap
            return module._compile(answer.js, fileName);
        };
    }

    sourceMapSupport.install()
    sourceMapSupport.addSourceProvider(function (filePath) {
        if (sourceMaps[filePath]) {
            return {map :sourceMaps[filePath]};
        } else {
            return null;
        }
    })    
    var originalPrepare = Error.prepareStackTrace;
    Error.prepareStackTrace = function (err, stack) {
        if (err._compile_err) {
            var data = err._mapped_data;
            var addColor = process.stdout.isTTY && !process.env.NODE_DISABLE_COLORS;
            return coffee.helpers.prettyErrorMessage(err, data.filePath, data.code, addColor)
        } else {
            return originalPrepare(err, stack);
        }
    }
}

module.exports = coffee