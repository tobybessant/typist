const api = require("express").Router()

api.get("/", (req, res) => {
	res.json({ message: "Hello from api!" })
})

api.use("/game", require("./game"))

module.exports = api
