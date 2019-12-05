const MockRequest = require("../mocks/http/mockRequest")
const MockResponse = require("../mocks/http/mockResponse")
const MockGameModel = require("../mocks/models/game")

const chai = require("chai")
const assert = chai.assert

const GameController = require("../../api/controllers/gameController")

let gameController, req, res

suite("Unit Tests :: Game Controller\n", () => {
	suite("Valid Data", () => {

		setup(() => {
			// setup mock model with a valid name property
			const name = "Name!"
			gameController = new GameController(MockGameModel)

			// setup mock request and response
			req = new MockRequest({ name })
			res = new MockResponse()
		})

		teardown(() => {
			gameController = null
			req = null
			res = null
		})

		test("Valid models return status code 200", async () => {
			// test create game
			await gameController.createGame(req, res)

			// check status code of response
			assert.propertyVal(res, "statusCode", 200, "Status code is not 200")
		})

		test("Valid models return a success message", async () => {
			// test create game
			await gameController.createGame(req, res)

			// check message of response
			assert.property(res.body, "message", "Response is missing a success message")
		})
	})

	suite("Invalid Data", () => {
		setup(() => {
			// setup mock model with no name property
			gameController = new GameController(MockGameModel)

			// setup mock request and response
			req = new MockRequest()
			res = new MockResponse()
		})

		teardown(() => {
			gameController = null
			req = null
			res = null
		})

		test("Models without a name return status code 400", async () => {
			// test create game
			await gameController.createGame(req, res)

			// check status code of response
			assert.propertyVal(res, "statusCode", 400, "Status code is not 400")
		})

		test("Models without a name return an error message", async () => {
			// test create game
			await gameController.createGame(req, res)

			// check error of response
			assert.property(res.body, "error", "Error message is not present")
		})
	})
})
