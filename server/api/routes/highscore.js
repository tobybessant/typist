const highscoreRouter = require("express").Router()
const HighscoreController = require("../controllers/HighscoreController.js")
const highscoreModel = require("../models/highscore")

const highscoreController = new HighscoreController(highscoreModel)

highscoreRouter.post("/save", async (req, res) => highscoreController.save(req, res))

highscoreRouter.get("/fetchall", async (req, res) => highscoreController.fetchAll(req, res))

module.exports = highscoreRouter
