const gameRouter = require("express").Router()
const GameController = require("../controllers/gameController")
const gameModel = require("../models/game")

const gameController = new GameController(gameModel)

gameRouter.post("/new", async (req, res) => gameController.createGame(req, res))

module.exports = gameRouter
