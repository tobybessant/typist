const MockRequest = require("../mocks/http/mockRequest")
const MockResponse = require("../mocks/http/mockResponse")
const MockHighscoreModel = require("../mocks/models/mongooseModel")

const chai = require("chai")
const assert = chai.assert

const HighscoreController = require("../../api/controllers/HighscoreController")

let highscoreController, req, res

suite("Unit Tests :: Highscore Controller\n", () => {
	suite("Valid Data", () => {

		setup(() => {
			// setup mock model with a valid name property
			const username = "Name!"
			const displayTime = "00:34:938"
			const accuracy = "54%"
			const wpm = "45"
			highscoreController = new HighscoreController(MockHighscoreModel)

			// setup mock request and response
			req = new MockRequest({ username, displayTime, accuracy, wpm })
			res = new MockResponse()
		})

		teardown(() => {
			highscoreController = null
			req = null
			res = null
		})

		test("Valid models return status code 200", async () => {
			// test create game
			await highscoreController.save(req, res)

			// check status code of response
			assert.propertyVal(res, "statusCode", 200, "Status code is not 200")
		})

		test("Valid models return a success message", async () => {
			// test create game
			await highscoreController.save(req, res)

			// check message of response
			assert.property(res.body, "message", "Response is missing a success message")
		})
	})

	suite("Invalid Data", () => {
		setup(() => {
			// setup mock model with no name property
			highscoreController = new HighscoreController(MockHighscoreModel)

			// setup mock request and response
			res = new MockResponse()
		})

		teardown(() => {
			highscoreController = null
			req = null
			res = null
		})

		test("Models without a name return status code 400", async () => {
			req = new MockRequest({ time: "00:50:129" })

			// test create game
			await highscoreController.save(req, res)

			// check status code of response
			assert.propertyVal(res, "statusCode", 400, "Status code is not 400")
		})

		test("Models without a name return an error message", async () => {
			req = new MockRequest({ time: "00:50:129" })

			// test create game
			await highscoreController.save(req, res)

			// check error of response
			assert.property(res.body, "error", "Error message is not present")
		})

		test("Models without a time return status code 400", async () => {
			req = new MockRequest({ username: "John" })

			// test create game
			await highscoreController.save(req, res)

			// check status code of response
			assert.propertyVal(res, "statusCode", 400, "Status code is not 400")
		})

		test("Models without a time return an error message", async () => {
			req = new MockRequest({ username: "John" })

			// test create game
			await highscoreController.save(req, res)

			// check error of response
			assert.property(res.body, "error", "Error message is not present")
		})
	})
})
