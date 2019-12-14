/**
  * Spy function written by:
  * Matthew Manela
  * http://matthewmanela.com/blog/a-simple-javascript-stubbing-function/
  *
  * DISCLAIMER This function has been slightly modified:
  * 	- function name changed from 'stub()' & 'of' -> 'spy()' & 'on'
  * 	- added reset function to reset function call data
  **/
module.exports = function spy() {
	return {
		on: function (name, callback, returnValue) {
			this[name] = function () {
				var args = Array.prototype.slice.call(arguments)
				this[name].calls.push(args)
				var ret = null
				if (callback) {
					ret = callback.apply(this, args)
				}
				if (returnValue) return returnValue
				return ret
			}
			this[name].calls = []
			return this
		},
		reset: function () {
			for (const method in this) {
				if (method !== "reset") { this[method].calls = [] }
			}
		}
	}
}
