const Player = require("./Player")
const ID_LENGTH = 4

module.exports = class Lobby {
	constructor(socket, hostPlayer) {
		if (hostPlayer) {
			this.code = this.generateCode()
			this.players = []
			this.paragraph = null
			this.self = null

			this.join(socket, hostPlayer)
		} else {
			throw new Error("Null host exception")
		}
	}

	join(socket, username) {
		if (username) {
			socket.join(this.code)
			const player = new Player(socket, username)
			this.players.push(player)
			if (this.players.length === 1) {
				this.host = player.username
			}
		} else {
			throw new Error("Null player exception")
		}
	}

	leave(player) {
		if (player) {
			this.players = this.players.filter((p) => {
				return p.id !== player.id
			})
		}
	}

	getPlayerList() {
		const pl = []
		this.players.forEach((player) => {
			pl.push({
				username: player.username,
				isReady: player.isReady,
				id: player.id
			})
		})
		return pl
	}

	getPlayer(socketId) {
		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i]
			if (player.socket.id === socketId) {
				return {
					username: player.username,
					isReady: player.isReady,
					id: player.id
				}
			}
		}
	}

	generateCode() {
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		let id = ""

		for (let i = 0; i < ID_LENGTH; i++) {
			id += letters[Math.floor(Math.random() * 26)]
		}

		return id
	}
}
