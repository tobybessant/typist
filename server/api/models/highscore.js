const mongoose = require("mongoose")
const database = require("../../database/index")

const Highscore = mongoose.model(database.TABLE_NAMES.HIGHSCORES, {
	username: String,
	time: String,
	wpm: String,
	accuracy: String
})

module.exports = Highscore
