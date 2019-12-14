const UUID = require("uuid/v1")

module.exports = class Player {
	constructor(socket, username) {
		if (username) {
			this.socket = socket
			this.username = username
			this.isReady = false
			this.id = UUID()
		} else {
			throw new Error("Invalid username")
		}
	}
}
