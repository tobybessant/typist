const gameRouter = require("express").Router()
const game = require("../models/game")

gameRouter.post("/new", async (req, res) => {
	const newGame = game({
		name: req.body.name
	})

	const savedGame = await newGame.save()

	res.json({ savedGame })
})

module.exports = gameRouter
