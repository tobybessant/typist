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
	}

	createLobby(socket, data) {
		if (data.username) {
			const lobby = new Lobby(socket, data.username)
			this.lobbies[lobby.code] = lobby
			this.sendPlayerDetails(socket, lobby.code)
			this.updateLobby(lobby)
			// console.log(this.lobbies[lobby.code])
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

	updateLobby(lobby) {
		const state = {
			players: lobby.getPlayerList(),
			host: lobby.host,
			code: lobby.code
		}
		this.io.to(lobby.code).emit("STATE_UPDATE", { state })
	}

	sendPlayerDetails(socket, lobbyCode) {
		const player = this.findPlayer(socket, lobbyCode)
		if (player) this.io.to(socket.id).emit("SELF", player)
	}

	findPlayer(socket, lobbyCode) {
		if (lobbyCode) {
			const lobby = this.lobbies[lobbyCode]
			return lobby.getPlayer(socket.id)
		}
	}
}
