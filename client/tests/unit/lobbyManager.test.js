const chai = require("chai")
const assert = chai.assert
const LobbyManager = require("../../src/services/lobbyManager")

suite("Unit Tests :: Lobby Manager\n", () => {

	let lobby, host, newPlayer

	teardown(() => {
		lobby = null
		host = null
		newPlayer = null
	})

	suite("Initialising a new lobby manager", () => {

		suite("Valid data", () => {
			setup(() => {
				host = "Toby"
				lobby = new LobbyManager(host)
			})

			test("Sets the host", async () => {
				assert.propertyVal(lobby, "host", host, "Host name not set correctly")
			})

			test("The connectedPlayers array is initialised as empty", () => {
				assert.isArray(lobby.connectedPlyers, "connectedPlayers is not an array")
			})

			test("Host is added to the connectedPlayers array", () => {
				assert.lengthOf(lobby.connectedPlyers, 1, "connectedPlayers is not length 1")
				assert.include(lobby.connectedPlyers, host, "connectedPlayers does not contain the host")
			})
		})

		suite("Invalid data", () => {
			setup(() => {
				host = null
			})

			test("Throws an error when constructed with invalid host name", async () => {
				host = null
				assert.throws((hostName) => new LobbyManager(hostName), "Null host exception", "Null host exception not thrown")
			})
		})

	})

	suite("Adding a new player", () => {
		suite("Valid data", () => {
			setup(() => {
				host = "Toby"
				newPlayer = "John"
				lobby = new LobbyManager(host)
			})

			test("Valid player is added to connected players array", async () => {
				lobby.join(newPlayer)

				assert.include(lobby.connectedPlyers, newPlayer, "connectedPlayers does not contain the new player")
			})

			test("Number of connected players increases by 1", async () => {
				let initialCount = lobby.connectedPlyers.length
				lobby.join(newPlayer)

				assert(lobby.connectedPlyers.length === ++initialCount)
			})
		})

		suite("Invalid data", () => {

			setup(() => {
				host = "Toby"
				newPlayer = null
				lobby = new LobbyManager(host)
			})

			test("Adding an invalid player throws an error", async () => {
				assert.throws((newPlayer) => lobby.join(newPlayer), "Null player exception")
			})

			test("Invalid player is not added to connected players array", async () => {
				assert.throws((newPlayer) => lobby.join(newPlayer), "Null player exception")
				assert.notInclude(lobby.connectedPlyers, newPlayer)
			})

			test("Number of connected players does not increase", async () => {
				let initialCount = lobby.connectedPlyers.length

				assert.throws((newPlayer) => lobby.join(newPlayer), "Null player exception")
				assert(initialCount === lobby.connectedPlyers.length, "Number of connected players increases")
			})
		})
	})

	suite("Removing a player", () => {

		suite("Valid Data", () => {
			setup(() => {
				host = "Toby"
				newPlayer = "John"
				lobby = new LobbyManager(host)
				lobby.join(newPlayer)
			})

			test("Number of connected players decreases by 1", async () => {
				let initialCount = lobby.connectedPlyers.length
				lobby.leave(newPlayer)

				assert(lobby.connectedPlyers.length === --initialCount)
			})

			test("Leaving player is no longer in the connectedPlayers array", async () => {
				lobby.leave(newPlayer)
				assert.notInclude(lobby.connectedPlyers, newPlayer, "Leaving player is still a connectedPlayer")
			})
		})
		suite("Invalid data", () => {

			setup(() => {
				host = "Toby"
				newPlayer = null
				lobby = new LobbyManager(host)
			})

			test("Throws an error if the leaving player is null", async () => {
				assert.throws((newPlayer) => lobby.leave(newPlayer), "Null player exception", "Null player exception not thrown")
			})

			test("Does not throw an error if the leaving player is not in the lobby", async () => {
				newPlayer = "Joanne"
				assert.doesNotThrow((newPlayer) => lobby.leave(newPlayer), "Null player exception is thrown")
			})
		})
	})
})
