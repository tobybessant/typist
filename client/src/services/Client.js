export default class Client {
	constructor(socket, username, lobbyCode) {
		this.socket = socket
		this.details = {}

		this.lobby = {
			code: "",
			host: "",
			players: []
		}

		this.handleEvents()
		this.setupLobby(username, lobbyCode)
	}

	handleEvents() {
		const c = this

		this.socket.on("STATE_UPDATE", (state) => this.updateState(c, state))
		this.socket.on("SELF", (player) => this.setPlayer(c, player))

		this.socket.on("disconnect", () => this.leaveLobby(c))
	}

	setPlayer(client, player) {
		client.details = player
	}

	updateState(client, data) {
		client.lobby.host = data.state.host
		client.lobby.code = data.state.code
		client.lobby.players = data.state.players
	}

	setupLobby(username, lobbyCode) {
		if (lobbyCode) {
			this.joinLobby(username, lobbyCode)
		} else {
			this.createLobby(username)
		}
	}

	createLobby(username) {
		this.socket.emit("CREATE_LOBBY", { username })
	}

	joinLobby(username, lobbyCode) {
		this.socket.emit("JOIN_LOBBY", { username, lobbyId: lobbyCode })
	}

	leaveLobby(client) {
		this.socket.emit("DISCONNECT", { client })
	}

	toggleReady() {
		this.details.isReady = !this.details.isReady
		this.stateChange()
	}

	stateChange() {
		this.socket.emit("PLAYER_STATE_UPDATE", { lobbyCode: this.lobby.code, player: this.details })
	}

}
