
export default class Client {
	constructor(socket, router, username, lobbyCode) {
		// set properties
		this.socket = socket
		this.router = router
		this.details = {}

		// initialise blank lobby data for view
		this.lobby = {
			code: "",
			host: "",
			players: [],
			gameOver: false
		}

		// setup websocket event handlers
		this.handleEvents()

		// setup lobby view - identify if player is starting or joining a lobby
		this.setupLobby(username, lobbyCode)
	}

	handleEvents() {
		// save client object
		const c = this

		// register websocket event handlers
		this.socket.on("STATE_UPDATE", (state) => this.updateState(c, state))
		this.socket.on("START", (state) => this.gameStarted(c, state))
		this.socket.on("SELF", (player) => this.setPlayer(c, player))
		this.socket.on("GAME_OVER", () => { this.lobby.gameOver = true })
	}

	setPlayer(client, player) {
		// set client details to details sent from server
		client.details = player
	}

	updateState(client, data) {
		// update client lobby state to new state from server
		client.lobby = { ...data.state }
	}

	setupLobby(username, lobbyCode) {
		// send join or create message to server based on whether a lobby code is present
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
		// navigate player home and emit leave message to server
		this.router.push({ name: "home" })
		this.socket.emit("LEAVE_LOBBY", { playerId: this.details.id, lobbyId: this.lobby.code })
	}

	toggleReady() {
		// update local client state
		this.details.isReady = !this.details.isReady
		// send new state to server
		this.stateChange()
	}

	startGame() {
		// send message to server that the host has started the game, sending the lobby code
		this.socket.emit("HOST_STARTED_GAME", { lobbyCode: this.lobby.code })
	}

	gameStarted(client, data) {
		// reset client stats incase a previous game has been played
		this.refreshClientStats()

		// send user to game component, along with their data and paragraphWords received from server websocket
		this.router.push({ name: "game", params: { client, paragraphWords: data.paragraphWords } })
	}

	returnToLobby() {
		// return user to lobby component, with existingClientData to not initialise new client object
		this.router.push({ name: "lobby", params: { existingClientData: this } })
	}

	stateChange() {
		// tell websocket server that this client has updated and send new data
		this.socket.emit("PLAYER_STATE_UPDATE", { lobbyCode: this.lobby.code, player: this.details })
	}

	finish() {
		// update client stats
		this.details.finished = true
		// send new state to websocket server
		this.stateChange()
	}

	refreshClientStats() {
		// reset player values ready to start a new game
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
