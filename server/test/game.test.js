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
		chai.request(app)
			.get("/api/game/new")
			.end((err, res) => {
				if (err) {
					assert.fail("Unexpected error")
					return
				}
				assert(res.status === 200, "Status code not 200")
				assert.isObject(res.body, "Response body is not JSON")
				assert.isDefined(String, res.body.savedGame._id, "Game not created")
			})
	})
})