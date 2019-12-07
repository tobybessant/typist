const ID_LENGTH = 4

module.exports = class Lobby {
	constructor(host) {
		if (host) {
			this.host = host
			this.connectedPlayers = host ? [host] : null
			this.id = this.createId()
		} else {
			throw new Error("Null host exception")
		}
	}

	join(player) {
		if (player) {
			this.connectedPlayers.push(player)
		} else {
			throw new Error("Null player exception")
		}
	}

	leave(player) {
		if (player) {
			this.connectedPlayers = this.connectedPlayers.filter((p) => {
				return p !== player
			})
		}
	}

	createId() {
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		let id = ""

		for (let i = 0; i < ID_LENGTH; i++) {
			id += letters[Math.floor(Math.random() * 26)]
		}

		return id
	}
}
