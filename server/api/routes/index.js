const api = require("express").Router()

api.use("/highscore", require("./highscore"))

module.exports = api
