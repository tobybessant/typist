module.exports = class Player {
	constructor(connection) {
		this.connection = connection
		this.username = ""
	}

	setUsername(username) {
		if (username) {
			this.username = username
		} else {
			throw new Error("Invalid username")
		}
	}
}
