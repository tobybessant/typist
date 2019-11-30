// dependancies
const chai = require("chai")
const expect = chai.expect
const chaiHttp = require("chai-http")
const app = require("../../index")

// chai setup
chai.use(chaiHttp)

// api routes test
describe("-= Running Integration Tests =-\n", () => {
	describe("Route '/api/game/new':", () => {
		describe("Valid Data", () => {
			it("Should return a new game", async () => {
				const game = require("../../api/models/game")
				const validGame = game({
					name: "Test game!"
				})

				let res = await chai.request(app)
					.post("/api/game/new")
					.set("Content-Type", "application/json")
					.send(validGame)

				expect(res.status).to.equal(200, "Status not 200")
				expect(res.body).to.be.instanceOf(Object, "Response data is not JSON")
				expect(res.body).to.have.property("gameName")
				expect(res.body.gameName).to.equal(validGame.name, "Returned game data does not match sent payload")
			})
		})

		describe("Invalid Data", () => {

			it("Should not add erronous games", async () => {
				const game = require("../../api/models/game")
				const invalidGame = game({
					invalidName: "Invalid test game!"
				})

				let res = await chai.request(app)
					.post("/api/game/new")
					.set("Content-Type", "application/json")
					.send(invalidGame)

				expect(res.status).to.equal(400, "Status not 400")
				expect(res.body).to.have.property("error", "Malformed request")
			})
		})
	})
})