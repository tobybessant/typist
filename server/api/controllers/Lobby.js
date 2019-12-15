const Player = require("./Player")
const ID_LENGTH = 4

module.exports = class Lobby {
	constructor(socket, hostPlayer) {
		if (hostPlayer) {
			this.code = this.generateCode()
			this.players = []
			this.paragraph = null

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

	leave(socket, player) {
		if (player) {
			socket.disconnect()
			this.players = this.players.filter((p) => {
				return p.id !== player.id
			})
		}
	}

	async playerUpdate(player) {
		return new Promise((resolve, reject) => {
			this.players.forEach((p) => {
				if (p.id === player.id) {
					p.isReady = player.isReady
					resolve()
				}
			})
			reject(new Error("No player with that ID"))
		})
	}

	getPlayerList() {
		const pl = []
		this.players.forEach((player) => {
			pl.push({
				id: player.id,
				socketId: player.socket.id,
				username: player.username,
				isReady: player.isReady
			})
		})
		return pl
	}

	getPlayerBySocketId(socketId) {
		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i]
			if (player.socket.id === socketId) {
				return {
					id: player.id,
					socketId: socketId,
					username: player.username,
					isReady: player.isReady
				}
			}
		}
		return null
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
