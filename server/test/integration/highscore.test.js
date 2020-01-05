const chai = require("chai")
const expect = chai.expect
const chaiHttp = require("chai-http")

const app = require("../../index")
const highscoreModel = require("../../api/models/highscore")

// chai setup
chai.use(chaiHttp)

let highscoreData

// api routes test
describe("Highscore route test", () => {
	describe("Route '/api/highscore/save':", () => {

		describe("Valid Data", () => {

			before(() => {
				highscoreData = {
					username: "Toby",
					displayTime: "00:45:875",
					wpm: "58",
					accuracy: "96%"
				}
			})

			after(async () => {
				highscoreData = null
				await highscoreModel.deleteMany({})
			})

			it("Should return a status 200 and success message", async () => {
				const res = await chai.request(app)
					.post("/api/highscore/save")
					.set("Content-Type", "application/json")
					.send(highscoreData)

				expect(res.status).to.equal(200, "Status not 200")
				expect(res.body).to.be.instanceOf(Object, "Response data is not JSON")
				expect(res.body).to.have.property("message", "Highscore saved")
			})
		})

		describe("Invalid Data", () => {

			before(() => {
				highscoreData = { }
			})

			after(() => {
				highscoreData = null
			})

			it("Should return a status 400 and error message", async () => {
				const res = await chai.request(app)
					.post("/api/highscore/save")
					.set("Content-Type", "application/json")
					.send(highscoreData)

				expect(res.status).to.equal(400, "Status not 400")
				expect(res.body).to.have.property("error", "Malformed request")
			})
		})
	})

	describe("Route '/api/highscore/fetchAll':", () => {

		describe("Valid Data", () => {

			before(async () => {
				highscoreData = {
					username: "Toby",
					displayTime: "00:45:875",
					wpm: "58",
					accuracy: "96%"
				}

				await chai.request(app)
					.post("/api/highscore/save")
					.set("Content-Type", "application/json")
					.send(highscoreData)
			})

			after(async () => {
				highscoreData = null
				await highscoreModel.deleteMany({})
			})

			it("Should return a status 200 and a list of highscores", async () => {
				const res = await chai.request(app)
					.get("/api/highscore/fetchAll")

				expect(res.status).to.equal(200, "Status not 200")
				expect(res.body).to.be.instanceOf(Object, "Response data is not JSON")
				expect(res.body).to.have.property("results")
				expect(res.body.results).to.be.instanceOf(Array)
				expect(res.body.results).to.have.length(1)
			})
		})
	})
})
