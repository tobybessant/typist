const workerSource = () => {
	const processWord = (typed, actual, index) => {
		const result = {}
		result.typed = typed
		result.class = typed === actual ? "correct" : "incorrect"
		result.index = index
		return result
	}

	self.onmessage = function (message) {
		let response = {
			operation: message.data.operation
		}
		switch (message.data.operation) {
		case "PROCESS_WORD":
			const word = message.data
			response.result = processWord(word.typedValue, word.correctValue, word.correctValueIndex)
			break
		default:
			response.error = "Worker operation unrecognised"
		}

		self.postMessage(response)
	}
}

let code = workerSource.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))

const blob = new Blob([code], {
	type: "application/javascript"
})
const wordWorkerSourceCode = URL.createObjectURL(blob)

module.exports = wordWorkerSourceCode
