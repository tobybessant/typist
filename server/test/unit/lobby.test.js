const chai = require("chai")
const assert = chai.assert
const Lobby = require("../../api/models/lobby")

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
				lobby = new Lobby(host)
			})

			test("Creates an ID", () => {
				assert.isDefined(lobby, "id", "ID has not been set")
			})

			test("Sets the host", async () => {
				assert.propertyVal(lobby, "host", host, "Host name not set correctly")
			})

			test("The connectedPlayers array is initialised as empty", () => {
				assert.isArray(lobby.connectedPlayers, "connectedPlayers is not an array")
			})

			test("Host is added to the connectedPlayers array", () => {
				assert.lengthOf(lobby.connectedPlayers, 1, "connectedPlayers is not length 1")
				assert.include(lobby.connectedPlayers, host, "connectedPlayers does not contain the host")
			})
		})

		suite("Invalid data", () => {
			setup(() => {
				host = null
			})

			test("Throws an error when constructed with invalid host name", async () => {
				host = null
				assert.throws((hostName) => new Lobby(hostName), "Null host exception", "Null host exception not thrown")
			})

			test("Does not set the host", () => {
				assert.throws((hostName) => new Lobby(hostName), "Null host exception")
				assert.isNull(lobby, "host", "Host has been set")
			})

			test("Does not set connectedPlayers", () => {
				assert.throws((hostName) => new Lobby(hostName), "Null host exception")
				assert.isNull(lobby, "connectedPlayers", "connectedPlayers has been set")
			})
		})

	})

	suite("Adding a new player", () => {
		suite("Valid data", () => {
			setup(() => {
				host = "Toby"
				newPlayer = "John"
				lobby = new Lobby(host)
			})

			test("Valid player is added to connected players array", async () => {
				lobby.join(newPlayer)

				assert.include(lobby.connectedPlayers, newPlayer, "connectedPlayers does not contain the new player")
			})

			test("Number of connected players increases by 1", async () => {
				let initialCount = lobby.connectedPlayers.length
				lobby.join(newPlayer)

				assert(lobby.connectedPlayers.length === ++initialCount)
			})
		})

		suite("Invalid data", () => {

			setup(() => {
				host = "Toby"
				newPlayer = null
				lobby = new Lobby(host)
			})

			test("Adding an invalid player throws an error", async () => {
				assert.throws((newPlayer) => lobby.join(newPlayer), "Null player exception")
			})

			test("Invalid player is not added to connected players array", async () => {
				assert.throws((newPlayer) => lobby.join(newPlayer), "Null player exception")
				assert.notInclude(lobby.connectedPlayers, newPlayer)
			})

			test("Number of connected players does not increase", async () => {
				const initialCount = lobby.connectedPlayers.length

				assert.throws((newPlayer) => lobby.join(newPlayer), "Null player exception")
				assert(initialCount === lobby.connectedPlayers.length, "Number of connected players increases")
			})
		})
	})

	suite("Removing a player", () => {

		suite("Valid Data", () => {
			setup(() => {
				host = "Toby"
				newPlayer = "John"
				lobby = new Lobby(host)
				lobby.join(newPlayer)
			})

			test("Leaving player is no longer in the connectedPlayers array", async () => {
				lobby.leave(newPlayer)
				assert.notInclude(lobby.connectedPlayers, newPlayer, "Leaving player is still a connectedPlayer")
			})

			test("Number of connected players decreases by 1", async () => {
				let initialCount = lobby.connectedPlayers.length
				lobby.leave(newPlayer)

				assert(lobby.connectedPlayers.length === --initialCount)
			})
		})
		suite("Invalid data", () => {

			setup(() => {
				host = "Toby"
				newPlayer = null
				lobby = new Lobby(host)
			})

			test("Does not throw an error if the leaving player is null", async () => {
				assert.doesNotThrow((newPlayer) => lobby.leave(newPlayer), "Null player exception", "Null player exception not thrown")
			})

			test("Number of connected players remains the same", async () => {
				const initialCount = lobby.connectedPlayers.length
				lobby.leave(newPlayer)

				assert(lobby.connectedPlayers.length === initialCount)
			})

			test("Does not throw an error if the leaving player is not in the lobby", async () => {
				newPlayer = "Joanne"
				assert.doesNotThrow((newPlayer) => lobby.leave(newPlayer), "Null player exception is thrown")
			})
		})
	})
})
