module.exports = class GameController {

	// inject model to use to allow mocking for tests
	constructor(gameModel) {
		this.GameModel = gameModel
	}

	// adds new game to database provided a valid name is received
	async createGame(req, res) {

		// check name is present in request
		const name = req.body.name
		if (name === undefined || name === "") {
			// if no name is present in payload return 400
			const error = "Malformed request"
			res.status(400).json({ error })
		} else {
			// create a new game document and save to database
			const game = new this.GameModel({ name })
			const newGame = await game.save()

			res.status(200).json({
				message: "Game created",
				gameName: newGame.name
			})
		}
	}
}
