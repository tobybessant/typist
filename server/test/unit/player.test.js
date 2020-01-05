const chai = require("chai")
const assert = chai.assert
const Player = require("../../api/controllers/Player")

suite("Unit Tests :: Player\n", () => {

	let PLAYER_COUNT, players, player, username

	teardown(() => {
		player = null
		username = null
	})

	suite("Initialising a new player", () => {

		suite("Valid data", () => {
			setup(() => {
				username = "Toby"
			})

			test("Player username is set correctly", () => {
				player = new Player(null, username)
				assert(player.username === username)
			})
		})

		suite("Invalid data [ null username ]", () => {

			setup(() => {
				username = null
			})

			test("Throws an error", () => {
				assert.throws(() => new Player(username), "Invalid username")
			})
		})
	})

	suite("Player UUID generation", () => {
		setup(() => {
			PLAYER_COUNT = 10000
			players = []
			for (let i = 0; i < PLAYER_COUNT; i++) {
				players.push(new Player(null, "p"))
			}
		})

		test("UUID is unique amongst 10,000 players", () => {
			const uniquePlayerIdCount = players.filter((player, i, self) => {
				return self.indexOf(player) === i
			})
			assert(uniquePlayerIdCount.length === PLAYER_COUNT)
		})
	})
})
