const mongoose = require("mongoose")
const database = require("../../database/index")

const Game = mongoose.model(database.TABLE_NAMES.GAMES, {
	name: String
})

module.exports = Game
