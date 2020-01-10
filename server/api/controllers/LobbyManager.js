const Lobby = require("./Lobby")

module.exports = class LobbyManager {
	constructor(socketIo) {
		// save io instance
		this.io = socketIo

		// initialise empty lobbies map
		this.lobbies = {}

		// register initial event handler to pass any new connection onto 'handleConnection'
		this.io.on("connection", (socket) => this.handleConnection(socket))
	}

	handleConnection(socket) {
		// register events that the server websocket nneeds to listen for
		socket.on("CREATE_LOBBY", (data) => this.createLobby(socket, data))
		socket.on("JOIN_LOBBY", (data) => this.joinLobby(socket, data))
		socket.on("REQUEST_SELF", (data) => this.sendPlayerDetails(socket, data))
		socket.on("PLAYER_STATE_UPDATE", (data) => this.playerUpdate(socket, data))
		socket.on("HOST_STARTED_GAME", (data) => this.startGame(socket, data))

		socket.on("disconnect", (data) => this.playerDisconnected(socket, data))
		socket.on("LEAVE_LOBBY", (data) => this.leaveLobby(socket, data))
	}

	createLobby(socket, data) {
		if (data.username) {
			// initialise new lobby
			const lobby = new Lobby(socket, data.username)
			this.lobbies[lobby.code] = lobby

			// send player their generated details (id, and other data stores)
			this.sendPlayerDetails(socket, lobby.code)

			// send new lobby details back to player
			this.updateLobby(lobby)
		}
	}

	joinLobby(socket, data) {
		// fetch lobby based on sent lobby code
		const lobby = this.lobbies[data.lobbyId]
		if (lobby) {
			// join user into lobby
			lobby.join(socket, data.username)

			// send player their generated details (id, and other data stores)
			this.sendPlayerDetails(socket, lobby.code)

			// send new lobby details back to player
			this.updateLobby(lobby)
		}
	}

	leaveLobby(socket, data) {
		// remove player from lobby using their id
		this.lobbies[data.lobbyId].leave(socket, { player: { id: data.playerId } })
	}

	playerDisconnected(socket) {
		// gracefully leave & update lobby if player unexpectedly disconnects
		if (socket) {
			const connection = this.findPlayerNoLobbyId(socket)
			if (connection) {
				const lobbyCode = connection.lobby.code
				connection.lobby.leave(socket, connection.player)
				if (connection.lobby.players.length > 0) {
					this.updateLobby(connection.lobby)
				} else {
					delete this.lobbies[lobbyCode]
				}
			}
		}
	}

	updateLobby(lobby) {
		// get new lobby state and send to players
		const state = {
			players: lobby.getPlayerList(),
			host: lobby.host,
			code: lobby.code,
			gameOver: lobby.checkGameOver()
		}
		this.io.to(lobby.code).emit("STATE_UPDATE", { state })
	}

	async startGame(socket, data) {
		// generate paragraph and send to players with 'START' event to start the game
		if (data.lobbyCode) {
			const lobby = this.lobbies[data.lobbyCode]
			lobby.generateParagraph().then((paragraphWords) => {
				this.io.to(data.lobbyCode).emit("START", { paragraphWords })
			})
		}
	}

	sendPlayerDetails(socket, lobbyCode) {
		// send player their details, such as generated id
		const player = this.findPlayerWithLobbyId(socket, lobbyCode)
		if (player) this.io.to(socket.id).emit("SELF", player)
	}

	findPlayerWithLobbyId(socket, lobbyCode) {
		// find player when a lobby code is sent
		if (lobbyCode) {
			const lobby = this.lobbies[lobbyCode]
			return lobby.getPlayerBySocketId(socket.id)
		}
		return null
	}

	findPlayerNoLobbyId(socket) {
		// find player when no lobby code is sent, using only the socket id (more expensive than method above)
		if (socket) {
			for (const lobbyCode in this.lobbies) {
				const player = this.findPlayerWithLobbyId(socket, lobbyCode)
				if (player) return { player, lobby: this.lobbies[lobbyCode] }
			}
		}
		return null
	}

	playerUpdate(socket, data) {
		const lobby = this.lobbies[data.lobbyCode]
		if (lobby) {
			// tell lobby a player has updated, sending the player state back & updating the lobby
			lobby.playerUpdate(data.player).then(() => {
				this.sendPlayerDetails(socket)
				this.updateLobby(lobby)
			})
		}
	}
}
