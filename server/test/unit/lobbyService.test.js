const chai = require("chai")
const assert = chai.assert
const MockLobby = require("../mocks/models/lobby")
const LobbyService = require("../../api/controllers/lobbyController")

suite("Unit Tests :: Lobby Service", () => {
	let lobbyService, lobby, id

	teardown(() => {
		id = null
		lobby = null
		lobbyService = null
	})

	suite("Adding a lobby", () => {
		suite("Valid data", () => {
			setup(() => {
				id = "XYZA"
				lobbyService = new LobbyService()
				lobby = new MockLobby(id)
			})

			test("Adding a lobby adds the lobby to the list", () => {
				lobbyService.addLobby(lobby)
				assert.property(lobbyService.activeLobbies, lobby.id)
				assert.propertyVal(lobbyService.activeLobbies, lobby.id, lobby)
			})

			test("Adding a lobby increases the lobby count by 1", () => {
				const initialCount = Object.keys(lobbyService.activeLobbies).length
				lobbyService.addLobby(lobby)
				assert(Object.keys(lobbyService.activeLobbies).length === (initialCount + 1))
			})
		})

		suite("Invalid data [ lobby is null ]", () => {
			setup(() => {
				lobbyService = new LobbyService()
				lobby = null
			})

			test("An error is thrown", () => {
				assert.throws((lobby) => lobbyService.addLobby(lobby))
			})

			test("The count of active lobbies remains the same", () => {
				const initialCount = lobbyService.activeLobbies
				assert.throws((lobby) => lobbyService.addLobby(lobby))
				assert(lobbyService.activeLobbies === (initialCount))
			})
		})

		suite("Invalid data [ lobby ID is null ]", () => {
			setup(() => {
				lobbyService = new LobbyService()
				lobby = new MockLobby(id)
			})

			test("An error is thrown", () => {
				assert.throws((lobby) => lobbyService.addLobby(lobby))
			})

			test("The count of active lobbies remains the same", () => {
				const initialCount = lobbyService.activeLobbies
				assert.throws((lobby) => lobbyService.addLobby(lobby))
				assert(lobbyService.activeLobbies === (initialCount))
			})
		})
	})

	suite("Removing a lobby", () => {
		suite("Valid data", () => {
			setup(() => {
				id = "XYZA"
				lobbyService = new LobbyService()
				lobby = new MockLobby(id)
			})

			test("Removig a lobby removes the lobby from the list", () => {
				lobbyService.removeLobby(lobby)
				assert.notProperty(lobbyService.activeLobbies, lobby.id)
			})

			test("Removing a lobby decreases the lobby count by 1", () => {
				const initialCount = Object.keys(lobbyService.activeLobbies).length
				lobbyService.removeLobby(lobby)
				assert(Object.keys(lobbyService.activeLobbies).length === (initialCount - 1))
			})
		})

		suite("Invalid data [ lobby ID is null ]", () => {
			setup(() => {
				lobbyService = new LobbyService()
				lobby = new MockLobby(id)
			})

			test("An error is not thrown", () => {
				assert.doesNotThrow((lobby) => lobbyService.addLobby(lobby))
			})

			test("The lobby list is unaffected", () => {
				const initialList = lobbyService.activeLobbies
				lobbyService.removeLobby(lobby)
				assert(lobbyService.activeLobbies === initialList)
			})
		})
	})
})
