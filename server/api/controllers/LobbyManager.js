const Lobby = require("./Lobby")

module.exports = class LobbyManager {
	constructor(socketIo) {
		this.io = socketIo
		this.lobbies = {}

		this.io.on("connection", (socket) => this.handleConnection(socket))
	}

	handleConnection(socket) {
		socket.on("CREATE_LOBBY", (data) => this.createLobby(socket, data))
		socket.on("JOIN_LOBBY", (data) => this.joinLobby(socket, data))
		socket.on("REQUEST_SELF", (data) => this.sendPlayerDetails(socket, data))
		socket.on("PLAYER_STATE_UPDATE", (data) => this.playerUpdate(socket, data))
		socket.on("HOST_STARTED_GAME", (data) => this.startGame(socket, data))

		socket.on("disconnect", (data) => this.leaveLobby(socket, data))
	}

	createLobby(socket, data) {
		if (data.username) {
			const lobby = new Lobby(socket, data.username)
			this.lobbies[lobby.code] = lobby
			this.sendPlayerDetails(socket, lobby.code)
			this.updateLobby(lobby)
		}
	}

	joinLobby(socket, data) {
		const lobby = this.lobbies[data.lobbyId]
		if (lobby) {
			lobby.join(socket, data.username)
			this.sendPlayerDetails(socket, lobby.code)
			this.updateLobby(lobby)
		}
	}

	leaveLobby(socket) {
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
			console.log(this.lobbies)
		}
	}

	updateLobby(lobby) {
		const state = {
			players: lobby.getPlayerList(),
			host: lobby.host,
			code: lobby.code
		}
		this.io.to(lobby.code).emit("STATE_UPDATE", { state })
	}

	async startGame(socket, data) {
		if (data.lobbyCode) {
			const lobby = this.lobbies[data.lobbyCode]
			lobby.generateParagraph().then((paragraphWords) => {
				this.io.to(data.lobbyCode).emit("START", { paragraphWords })
			})
		}
	}

	sendPlayerDetails(socket, lobbyCode) {
		const player = this.findPlayerWithLobbyId(socket, lobbyCode)
		if (player) this.io.to(socket.id).emit("SELF", player)
	}

	findPlayerWithLobbyId(socket, lobbyCode) {
		if (lobbyCode) {
			const lobby = this.lobbies[lobbyCode]
			return lobby.getPlayerBySocketId(socket.id)
		}
		return null
	}

	findPlayerNoLobbyId(socket) {
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
			lobby.playerUpdate(data.player).then(() => {
				this.sendPlayerDetails(socket)
				this.updateLobby(lobby)
			})
		}
	}
}
