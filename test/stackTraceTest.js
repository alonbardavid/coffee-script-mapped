var coffee = require("../lib/coffee-script-mapped");
var test =require("./coffeeTest");
var expect = require("chai").expect;

var coffeeVersion = coffee.VERSION.match(/(\d)\.(\d)/);
var versionAbove17;
versionAbove17 = coffeeVersion[1] > 1 || (coffeeVersion[1] == 1 && coffeeVersion[2] > 6);
describe("stack trace test", function () {
    describe("sourcemaps on", function () {
        it("should show proper coffee stack", function () {
            try {
                test.innerErr()
            } catch (err) {
                var lines = err.stack.split("\n")
		if (versionAbove17) {
                	expect(lines[1]).to.match(/coffeeTest\.coffee:3:15\)$/)
		} else {
                	expect(lines[1]).to.match(/coffeeTest\.coffee:3:14\)$/)
		}
                expect(lines[2]).to.match(/stackTraceTest\.js:12:22\)$/)
            }
        })
        it("should show proper coffee stack with nested calls", function () {
            try {
                test.outerErr()
            } catch (err) {
                var lines = err.stack.split("\n")
		if (versionAbove17) {
			expect(lines[1]).to.match(/coffeeTest\.coffee:3:15\)$/)
                	expect(lines[2]).to.match(/coffeeTest\.coffee:5:13\)$/)
		} else {
	                expect(lines[1]).to.match(/coffeeTest\.coffee:3:14\)$/)
			expect(lines[2]).to.match(/coffeeTest\.coffee:5:4\)$/)
		}
            }
        })
        it("should show proper coffee stack with multiple files", function () {
            try {
                test.nestedErr()
            } catch (err) {
                var lines = err.stack.split("\n")
		if (versionAbove17) {
			expect(lines[1]).to.match(/anotherErr\.coffee:2:15\)$/)
               		expect(lines[2]).to.match(/coffeeTest\.coffee:7:16\)$/)
		} else {
	                expect(lines[1]).to.match(/anotherErr\.coffee:2:14\)$/)
	                expect(lines[2]).to.match(/coffeeTest\.coffee:7:4\)$/)
		}
            }
        })
		it("should show proper coffee stack when we have syntax error", function() {
			try {
				require("./badSyntax")
			} catch (err) {
				var result = err.stack
                expect(result).to.match(/badSyntax.coffee:7:1.*unmatched }/)
			}
		});
    });
})
