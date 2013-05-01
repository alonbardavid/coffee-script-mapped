anotherErr = require "./anotherErr"
exports.innerErr = () ->
    throw new Error("Inside Inner Err");
exports.outerErr = () ->
    exports.innerErr()
exports.nestedErr = () ->
    anotherErr.throwErr()