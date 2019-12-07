const chai = require("chai")
const assert = chai.assert
const MockLobby = require("../mocks/models/lobby")
const LobbyService = require("../../api/controllers/lobbyController")

suite("Unit Tests :: Lobby Service", () => {
	let lobbyService, lobby, id

	teardown(() => {
		lobby = null
		lobbyService = null
	})

	setup(() => {
		id = "XYZA"

		lobbyService = new LobbyService()
		lobby = new MockLobby(id)
	})

	suite("Valid data", () => {
		test("Adding a lobby adds the lobby to the list", () => {
		})
	})
})
