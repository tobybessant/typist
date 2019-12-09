module.exports = class LobbyService {
	constructor() {
		this.activeLobbies = {}
	}

	addLobby(lobby) {
		if (lobby && lobby.id) {
			this.activeLobbies[lobby.id] = lobby
		} else {
			throw new Error("Malformed lobby")
		}
	}

	removeLobby(id) {
		if (this.activeLobbies[id]) {
			delete this.activeLobbies[id]
		}
	}

	getLobby(id) {
		if (!id) {
			throw new Error("Invalid search ID")
		}

		if (!this.activeLobbies[id]) {
			throw new Error("Lobby does not exist")
		}

		return this.activeLobbies[id]
	}
}
