// dependancies
const chai = require("chai")
const assert = chai.assert

const GameController = require("../../api/controllers/gameController")

let gameController, req, res

suite("Unit Tests :: GameController :: Valid Data", () => {

	setup(() => {
		// setup mock model to remove db connection requirement
		class mockGameModel {
			save() {
				return
			}
		}
		gameController = new GameController(mockGameModel)

		// setup mock request and response
		req = {
			body: { name: "Valid name" }
		}
		res = new Object()
	})

	teardown(() => {
		gameController = null
		req = null
		res = null
	})

	test("Valid models return status code 200", async () => {
		// test create game 
		res = await gameController.createGame(req ,res)

		// check status code of response
		assert.propertyVal(res, "status", 200, "Status code is not 200")
	})

	test("Valid models return a success message", async () => {
		// test create game 
		res = await gameController.createGame(req ,res)

		// check message of response
		assert.property(res, "message", "Response is missing a success message")
	})
})

suite("Unit Tests :: GameController :: Invalid Data", () => {
	setup(() => {
		// setup mock model to remove db connection requirement
		class mockGameModel {
			save() {
				return
			}
		}
		gameController = new GameController(mockGameModel)

		// setup mock request and response
		req = {
			body: { }
		}
		res = new Object()
	})

	teardown(() => {
		gameController = null
		req = null
		res = null
	})

	test("Models without a name return status code 400", async () => {
		// test create game 
		res = await gameController.createGame(req ,res)

		// check status code of response
		assert.propertyVal(res, "status", 400, "Status code is not 400")
	})

	test("Models without a name return an error message", async () => {
		// test create game 
		res = await gameController.createGame(req ,res)

		// check error of response
		assert.property(res, "error", "Error message is not present")
	})
})