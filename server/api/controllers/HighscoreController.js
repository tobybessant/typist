module.exports = class GameController {

	// inject model to use to allow mocking for tests
	constructor(highscoreModel) {
		this.Highscore = highscoreModel
	}

	// adds new game to database provided a valid name is received
	async save(req, res) {
		console.log(req.body)
		// check name is present in request
		const username = req.body.username
		const time = req.body.displayTime
		const wpm = req.body.wpm
		const accuracy = req.body.accuracy
		if (!username || !time || !wpm || !accuracy) {
			// if no name is present in payload return 400
			const error = "Malformed request"
			res.status(400).json({ error })
		} else {
			// create a new game document and save to database
			const highscore = new this.Highscore({ username, time, wpm, accuracy })
			await highscore.save()

			res.status(200).json({
				message: "Highscore saved"
			})
		}
	}

	// fetches all highscores
	async fetchAll(req, res) {
		const results = await this.Highscore.find({})

		res.status(200).json({
			results
		})
	}
}
