var randomWords = require("random-words")
const Player = require("./Player")
const ID_LENGTH = 4

module.exports = class Lobby {
	constructor(socket, hostPlayer) {
		if (hostPlayer) {
			this.code = this.generateCode()

			// set colours array for the lobby
			this.availableCols = [
				"rgba(67,197,158,0.5)",
				"rgba(87,190,255,0.5)",
				"rgba(249,185,242,0.5)",
				"rgba(255, 188, 107, 0.5)",
				"rgba(227, 84, 96, 0.5)"
			]

			// initialise stores
			this.players = []
			this.paragraph = []

			// join hosting player
			this.join(socket, hostPlayer)
		} else {
			throw new Error("Null host exception")
		}
	}

	join(socket, username) {
		if (username) {
			// join player into this lobby's socket.io room
			socket.join(this.code)

			// join player into the lobby
			const player = new Player(socket, username)
			this.assignColour(player)
			this.players.push(player)

			// if the player is the first player then set them as the host
			if (this.players.length === 1) {
				this.host = { username: player.username, id: player.id }
			}
		} else {
			throw new Error("Null player exception")
		}
	}

	leave(socket, player) {
		if (player) {
			// disconnect from socket
			socket.disconnect()

			// remove from lobby player list
			this.players = this.players.filter((p) => {
				return p.id !== player.id
			})

			// if the player was the host ad there are still players in the lobby then assign a new host
			if (player.id === this.host.id && this.players.length >= 1) {
				const newHost = this.players[0]
				this.host = { username: newHost.username, id: newHost.id }
			}
		}
	}

	async playerUpdate(player) {
		return new Promise((resolve, reject) => {
			// find player seding update based on id
			this.players.forEach((p) => {
				if (p.id === player.id) {
					// for each property in the payload, update lobby version of the player
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
		// return reduced player information, omitting socket details.
		const pl = []
		this.players.forEach((player) => {
			// map all player info with new socketId key
			const playerNoSocket = {
				socketId: player.socket.id,
				...player
			}
			// remove full socket data
			delete playerNoSocket.socket

			// add to payload
			pl.push(playerNoSocket)
		})

		// return sorted by score descending
		return pl.sort((playerA, playerB) => {
			return playerB.wpm - playerA.wpm
		})
	}

	getPlayerBySocketId(socketId) {
		// search players based on socket id
		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i]
			if (player.socket.id === socketId) {
				// copy, delete socket data, and return player object
				const playerNoSocket = { ...player }
				delete playerNoSocket.socket
				return playerNoSocket
			}
		}
		return null
	}

	checkGameOver() {
		// if all players have 'finished' flag then game is over
		if (this.players.filter(p => p.finished).length === this.players.length) {
			return true
		}
		return false
	}

	generateCode() {
		// generate random code from alphabet
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		let id = ""

		for (let i = 0; i < ID_LENGTH; i++) {
			id += letters[Math.floor(Math.random() * 26)]
		}

		return id
	}

	generateParagraph() {
		// use randomWords npm package to return an array of 30 random words, with max char length of 5
		return new Promise((resolve, reject) => {
			try {
				resolve(randomWords({ exactly: 30, maxLength: 5 }))
			} catch (err) {
				reject(err)
			}
		})
	}

	assignColour(player) {
		// assign colour to player and remove it from the available colours array
		const randomColourIndex = Math.floor(Math.random() * this.availableCols.length)
		player.setColour(this.availableCols[randomColourIndex])
		this.availableCols.splice(randomColourIndex, 1)
	}
}
