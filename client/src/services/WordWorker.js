// save worker code into variable to get around wrong MIME type error
const workerSource = () => {
	// compare word and return result correct/incorrect
	const processWord = (typed, actual, index) => {
		const result = {}
		result.typed = typed
		result.class = typed === actual ? "correct" : "incorrect"
		result.index = index
		return result
	}

	self.onmessage = function (message) {
		// save operation being sent to feedback to client
		let response = {
			operation: message.data.operation
		}
		// interrogate operation
		switch (message.data.operation) {
		case "PROCESS_WORD":
			// do comparison of word
			const word = message.data
			response.result = processWord(word.typedValue, word.correctValue, word.correctValueIndex)
			break
		default:
			response.error = "Worker operation unrecognised"
		}

		// post message back to client
		self.postMessage(response)
	}
}

// cast to string and remove initial 'workerSource' syntax
let code = workerSource.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))

// initialise a new blob with source code
const blob = new Blob([code], {
	type: "application/javascript"
})

// create url for client to request
const wordWorkerSourceCode = URL.createObjectURL(blob)

// return newly created blob url for 'new Worker(url)' to use
module.exports = wordWorkerSourceCode
