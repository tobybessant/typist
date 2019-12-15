const chai = require("chai")
const assert = chai.assert
const MockSocket = require("../mocks/socket/socket")
const Lobby = require("../../api/controllers/Lobby")

suite("Unit Tests :: Lobby\n", () => {

	let socket, lobby, host, newPlayer

	teardown(() => {
		socket = null
		lobby = null
		host = null
		newPlayer = null
	})

	suite("Initialising a new lobby", () => {

		suite("Valid data", () => {
			setup(() => {
				socket = new MockSocket()
				host = "Toby"
				lobby = new Lobby(socket, host)
			})

			test("Creates an ID", () => {
				assert.isDefined(lobby, "code", "ID has not been set")
			})

			test("Sets the host", async () => {
				assert.propertyVal(lobby, "host", host, "Host name not set correctly")
			})

			test("The players array is initialised as empty", () => {
				assert.isArray(lobby.players, "players is not an array")
			})

			test("Host is added to the players array", () => {
				assert.lengthOf(lobby.players, 1, "players is not length 1")

				const playerUsernames = []
				lobby.players.forEach(player => playerUsernames.push(player.username))

				assert.include(playerUsernames, host, "players does not contain the host")
			})
		})

		suite("Invalid data", () => {
			setup(() => {
				socket = new MockSocket()
			})

			test("Throws an error when constructed with invalid host name", async () => {
				assert.throws((hostName) => new Lobby(socket, hostName), "Null host exception", "Null host exception not thrown")
			})

			test("Does not set the host", () => {
				assert.throws((hostName) => new Lobby(socket, hostName), "Null host exception")
				assert.isNull(lobby, "host", "Host has been set")
			})

			test("Does not set players", () => {
				assert.throws((hostName) => new Lobby(socket, hostName), "Null host exception")
				assert.isNull(lobby, "players", "players has been set")
			})
		})

	})

	suite("Adding a new player", () => {
		suite("Valid data", () => {
			setup(() => {
				socket = new MockSocket()
				host = "Toby"
				newPlayer = "John"
				lobby = new Lobby(socket, host)
			})

			test("Valid player is added to connected players array", async () => {
				lobby.join(socket, newPlayer)
				const playerUsernames = []
				lobby.players.forEach(player => playerUsernames.push(player.username))

				assert.include(playerUsernames, newPlayer, "players does not contain the new player")
			})

			test("Number of connected players increases by 1", async () => {
				let initialCount = lobby.players.length
				lobby.join(socket, newPlayer)

				assert(lobby.players.length === ++initialCount)
			})
		})

		suite("Invalid data", () => {

			setup(() => {
				socket = new MockSocket()
				host = "Toby"
				newPlayer = null
				lobby = new Lobby(socket, host)
			})

			test("Adding an invalid player throws an error", async () => {
				assert.throws((newPlayer) => lobby.join(socket, newPlayer), "Null player exception")
			})

			test("Invalid player is not added to connected players array", async () => {
				assert.throws((newPlayer) => lobby.join(socket, newPlayer), "Null player exception")
				assert.notInclude(lobby.players, newPlayer)
			})

			test("Number of connected players does not increase", async () => {
				const initialCount = lobby.players.length

				assert.throws((newPlayer) => lobby.join(socket, newPlayer), "Null player exception")
				assert(initialCount === lobby.players.length, "Number of connected players increases")
			})
		})
	})

	suite("Removing a player", () => {

		suite("Valid Data", () => {
			setup(() => {
				socket = new MockSocket()
				host = "Toby"
				newPlayer = "John"
				lobby = new Lobby(socket, host)
				lobby.join(socket, newPlayer)
			})

			test("Leaving player is no longer in the players array", async () => {
				const newestPlayer = lobby.players[1]
				lobby.leave(socket, newestPlayer)
				assert.notInclude(lobby.players, newestPlayer, "Leaving player is still a connectedPlayer")
			})

			test("Number of connected players decreases by 1", async () => {
				let initialCount = lobby.players.length

				const newestPlayer = lobby.players[1]
				lobby.leave(socket, newestPlayer)

				assert(lobby.players.length === --initialCount)
			})
		})
		suite("Invalid data", () => {

			setup(() => {
				socket = new MockSocket()
				host = "Toby"
				newPlayer = null
				lobby = new Lobby(socket, host)
			})

			test("Does not throw an error if the leaving player is null", async () => {
				assert.doesNotThrow((newPlayer) => lobby.leave(socket, newPlayer), "Null player exception", "Null player exception not thrown")
			})

			test("Number of connected players remains the same", async () => {
				const initialCount = lobby.players.length
				lobby.leave(socket, newPlayer)

				assert(lobby.players.length === initialCount)
			})

			test("Does not throw an error if the leaving player is not in the lobby", async () => {
				newPlayer = "Joanne"
				assert.doesNotThrow((newPlayer) => lobby.leave(socket, newPlayer), "Null player exception is thrown")
			})
		})
	})
})
