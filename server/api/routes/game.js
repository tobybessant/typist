const gameRouter = require("express").Router()
const game = require("../models/game")

gameRouter.post("/new", async (req, res) => {
	if (req.body.name) {
		const newGame = game({
			name: req.body.name
		})
		const savedGame = await newGame.save()
		res.status(200).json({ savedGame })
	} else {
		res.status(400).json({ errors: ["Malformed request."] })
	}
})

module.exports = gameRouter
