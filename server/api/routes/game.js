const gameRouter = require("express").Router()
const game = require("../models/game")

gameRouter.get("/new", async (req, res) => {
	const newGame = game({
		name: "New game!"
	})

	const savedGame = await newGame.save()

	res.json({ savedGame })
})

module.exports = gameRouter
