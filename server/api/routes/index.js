const api = require("express").Router()

api.get("/", (req, res) => {
	res.json({ message: "Hello from api!" })
})

api.use("/highscore", require("./highscore"))

module.exports = api
