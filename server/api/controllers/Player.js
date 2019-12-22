const UUID = require("uuid/v1")

module.exports = class Player {
	constructor(socket, username) {
		if (username) {
			this.socket = socket
			this.username = username
			this.isReady = false
			this.finished = false
			this.wordIndex = 0
			this.correctWordCount = 0
			this.time = -9999999
			this.displayTime = ""
			this.id = UUID()
		} else {
			throw new Error("Invalid username")
		}
	}

	setColour(colour) {
		this.colour = colour
	}
}
