
export default class Client {
	constructor(socket, router, username, lobbyCode) {
		this.socket = socket
		this.router = router
		this.details = {}

		this.lobby = {
			code: "",
			host: "",
			players: [],
			gameOver: false
		}

		this.handleEvents()
		this.setupLobby(username, lobbyCode)
	}

	handleEvents() {
		const c = this

		this.socket.on("STATE_UPDATE", (state) => this.updateState(c, state))
		this.socket.on("START", (state) => this.gameStarted(c, state))
		this.socket.on("SELF", (player) => this.setPlayer(c, player))
		this.socket.on("GAME_OVER", () => { this.lobby.gameOver = true })
	}

	setPlayer(client, player) {
		client.details = player
	}

	updateState(client, data) {
		client.lobby = { ...data.state }
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

	leaveLobby() {
		this.router.push({ name: "home" })
		this.socket.emit("LEAVE_LOBBY", { playerId: this.details.id, lobbyId: this.lobby.code })
	}

	toggleReady() {
		this.details.isReady = !this.details.isReady
		this.stateChange()
	}

	startGame() {
		this.socket.emit("HOST_STARTED_GAME", { lobbyCode: this.lobby.code })
	}

	gameStarted(client, data) {
		this.refreshClientStats()
		this.router.push({ name: "game", params: { client, paragraphWords: data.paragraphWords } })
	}

	returnToLobby() {
		this.router.push({ name: "lobby", params: { existingClientData: this } })
	}

	stateChange() {
		this.socket.emit("PLAYER_STATE_UPDATE", { lobbyCode: this.lobby.code, player: this.details })
	}

	finish() {
		this.details.finished = true
		this.stateChange()
	}

	refreshClientStats() {
		this.details.isReady = false
		this.details.finished = false
		this.details.wordIndex = 0
		this.details.correctWordCount = 0
		this.details.time = -9999999
		this.details.displayTime = ""
		this.details.wordAccuracy = ""
		this.details.wpm = ""
		this.stateChange()
	}
}
