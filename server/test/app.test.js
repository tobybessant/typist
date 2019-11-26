
const chai = require("chai")
const expect = chai.expect
const chaiHttp = require("chai-http")
const app = require("../index")

chai.use(chaiHttp)

describe("API /", () => {
	it("Should return a message", (done) => {
		chai.request(app)
			.get("/")
			.end((err, res) => {
				if (err) {
					return
				}
				expect(res).to.have.status(200)
				expect(res.body).to.be.an("object")
				expect(res.body).to.haveOwnProperty("message")
				done()
			})
	})
})
