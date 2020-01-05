var randomWords = require("random-words")
const Player = require("./Player")
const ID_LENGTH = 4

module.exports = class Lobby {
	constructor(socket, hostPlayer) {
		if (hostPlayer) {
			this.code = this.generateCode()

			this.availableCols = [
				"rgba(67,197,158,0.5)",
				"rgba(87,190,255,0.5)",
				"rgba(249,185,242,0.5)",
				"rgba(255, 188, 107, 0.5)",
				"rgba(227, 84, 96, 0.5)"
			]

			this.players = []
			this.paragraph = []
			this.join(socket, hostPlayer)
		} else {
			throw new Error("Null host exception")
		}
	}

	join(socket, username) {
		if (username) {
			socket.join(this.code)
			const player = new Player(socket, username)
			this.assignColour(player)
			this.players.push(player)
			if (this.players.length === 1) {
				this.host = { username: player.username, id: player.id }
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
			if (player.id === this.host.id && this.players.length >= 1) {
				const newHost = this.players[0]
				this.host = { username: newHost.username, id: newHost.id }
			}
		}
	}

	async playerUpdate(player) {
		return new Promise((resolve, reject) => {
			this.players.forEach((p) => {
				if (p.id === player.id) {
					for (const property in player) {
						p[property] = player[property]
					}
					resolve()
				}
			})
			reject(new Error("No player with that ID"))
		})
	}

	getPlayerList() {
		const pl = []
		this.players.forEach((player) => {
			const playerNoSocket = {
				socketId: player.socket.id,
				...player
			}
			delete playerNoSocket.socket
			pl.push(playerNoSocket)
		})
		return pl.sort((playerA, playerB) => {
			return playerB.wpm - playerA.wpm
		})
	}

	getPlayerBySocketId(socketId) {
		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i]
			if (player.socket.id === socketId) {
				const playerNoSocket = { ...player }
				delete playerNoSocket.socket
				return playerNoSocket
			}
		}
		return null
	}

	checkGameOver() {
		if (this.players.filter(p => p.finished).length === this.players.length) {
			return true
		}
		return false
	}

	generateCode() {
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		let id = ""

		for (let i = 0; i < ID_LENGTH; i++) {
			id += letters[Math.floor(Math.random() * 26)]
		}

		return id
	}

	generateParagraph() {
		return new Promise((resolve, reject) => {
			try {
				resolve(randomWords({ exactly: 30, maxLength: 5 }))
			} catch (err) {
				reject(err)
			}
		})
	}

	assignColour(player) {
		const randomColourIndex = Math.floor(Math.random() * this.availableCols.length)
		player.setColour(this.availableCols[randomColourIndex])
		this.availableCols.splice(randomColourIndex, 1)
	}
}
