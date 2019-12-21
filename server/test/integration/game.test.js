/*
const chai = require("chai")
const expect = chai.expect
const chaiHttp = require("chai-http")

const app = require("../../index")
const game = require("../../api/models/game")

// chai setup
chai.use(chaiHttp)

let gameData

// api routes test
describe("-= Running Integration Tests =-\n", () => {
	describe("Route '/api/game/new':", () => {

		describe("Valid Data", () => {

			before(() => {
				gameData = game({
					name: "Test game!"
				})
			})

			after(() => {
				gameData = null
			})

			it("Should return a new game", async () => {
				const res = await chai.request(app)
					.post("/api/game/new")
					.set("Content-Type", "application/json")
					.send(gameData)

				expect(res.status).to.equal(200, "Status not 200")
				expect(res.body).to.be.instanceOf(Object, "Response data is not JSON")
				expect(res.body).to.have.property("gameName")
				expect(res.body.gameName).to.equal(gameData.name, "Returned game data does not match sent payload")
			})
		})

		describe("Invalid Data", () => {

			before(() => {
				gameData = game({ })
			})

			after(() => {
				gameData = null
			})

			it("Should not add erronous games", async () => {
				const res = await chai.request(app)
					.post("/api/game/new")
					.set("Content-Type", "application/json")
					.send(gameData)

				expect(res.status).to.equal(400, "Status not 400")
				expect(res.body).to.have.property("error", "Malformed request")
			})
		})
	})
})
*/
