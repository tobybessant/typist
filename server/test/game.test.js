// dependancies
const chai = require("chai")
const assert = chai.assert
const chaiHttp = require("chai-http")
const app = require("../index")

// chai setup
chai.use(chaiHttp)

// api routes test
suite("GAMES API ROUTES", () => {
	test("'/api/game/new' route should return a new game", () => {
		const game = require("../api/models/game")
		const validGame = game({
			name: "Test game!"
		})

		chai.request(app)
			.post("/api/game/new")
			.send(validGame)
			.end((err, res) => {
				if (err) {
					assert.fail("Unexpected error")
					return
				}
				assert(res.status === 200, "Status code not 200")
				assert.isObject(res.body, "Response body is not JSON")
				assert.isDefined(String, res.body.savedGame._id, "Game not created")
				assert.equal(validGame.name, res.body.savedGame.name, "Game name does not match payload")
			})
	}),

	test("'/api/game/new' route should not add erronous games", () => {
		const game = require("../api/models/game")
		const invalidGame = game({
			invalidName: "Invalid test game!"
		})

		chai.request(app)
			.post("/api/game/new")
			.send(invalidGame)
			.end((err, res) => {
				if (err) {
					assert.fail("Unexpected error")
					return
				}
				console.log(res)
				assert(res.status === 400, "Status code is 400")
			})
	})
})