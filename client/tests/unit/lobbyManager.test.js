const chai = require("chai")
const assert = chai.assert
const LobbyManager = require("../../src/services/lobbyManager")

suite("Unit Tests :: Lobby Manager\n", () => {

	let lobbyManager, hostName

	suite("Initialising a new lobby manager", () => {

		teardown(() => {
			lobbyManager = null
			hostName = null
		})

		test("Sets the host given valid data", async () => {
			hostName = "Toby"
			lobbyManager = new LobbyManager(hostName)
			assert.propertyVal(lobbyManager, "host", hostName, "Host name not set correctly")
		})

		test("Does not set the host for invalid data", async () => {
			hostName = null
			lobbyManager = new LobbyManager(hostName)
			assert.isUndefined(lobbyManager.host, "Host name was set with invalid data")
		})

		test("Throws an error when constructed with invalid host name", async () => {
			hostName = null
			assert.throws(new LobbyManager(hostName), Error, "Error thrown")
		})

		test("The connected players array is initialised as empty", () => {
			hostName = "Harold"
			lobbyManager = new LobbyManager(hostName)

			assert.isArray(lobbyManager.connectedPlyers, "connectedPlayers is not an array")
		})

		test("Host is added to the connectedPlayers array", () => {
			hostName = "Lucy"
			lobbyManager = new LobbyManager(hostName)

			assert.lengthOf(lobbyManager.connectedPlyers, 1, "connectedPlayers is not length 1")
			assert.include(lobbyManager.connectedPlyers, hostName, "connectedPlayers does not contain the host")
		})

	})

	suite("Adding a new player", () => {
		let newPlayer

		setup(() => {
			hostName = "Toby"
			lobbyManager = new LobbyManager(hostName)
		})

		teardown(() => {
			lobbyManager = null
			hostName = null
			newPlayer = null
		})

		test("Valid player is added to connected players array", async () => {
			newPlayer = "John"
			lobbyManager.join(newPlayer)
			assert.include(lobbyManager.connectedPlyers, hostName, "connectedPlayers does not contain the new player")
		})

		test("Number of connected players increases by 1", async () => {
			newPlayer = "John"
			assert.increasesBy(lobbyManager.join(newPlayer), lobbyManager.connectedPlyers.length, 1, "Number of connected players does not increase by 1")
		})

		test("Invalid player is not added to connected players array", async () => {
			newPlayer = null
			lobbyManager.join(newPlayer)
			assert.notInclude(lobbyManager.connectedPlyers, hostName, "connectedPlayers contains the new player")
		})

		test("Number of connected players does not increase", async () => {
			newPlayer = null
			assert.doesNotIncrease(lobbyManager.join(newPlayer), lobbyManager.connectedPlyers.length, "Number of connected players increases")
		})
	})
})
