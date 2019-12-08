const chai = require("chai")
const assert = chai.assert
const Player = require("../../api/models/player")

suite("Unit Tests :: Player\n", () => {

	let player, username

	teardown(() => {
		player = null
		username = null
	})

	suite("Initialising a new lobby manager", () => {

		suite("Valid data", () => {
			setup(() => {
				player = new Player()
				username = "Toby"
			})

			test("Player username is set correctly", () => {
				player.setUsername(username)
				assert(player.username === username)
			})
		})

		suite("Invalid data [ null username ]", () => {

			setup(() => {
				player = new Player()
			})

			test("Throws an error", () => {
				assert.throws(() => player.setUsername(username), "Invalid username")
			})
		})
	})
})
