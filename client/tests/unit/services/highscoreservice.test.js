/* eslint-disable no-unused-expressions */

import { expect } from "chai"
import Spy from "../../../../server/test/utilities/spy"
import HighscoreService from "../../../src/services/HighscoreService"

describe("Highscore service", () => {
	// eslint-disable-next-line no-unused-vars
	let axios, data, highscoreService, mockOKResponse, mockNotOKResponse, response

	afterEach(() => {
		axios = null
		data = null
	})

	describe("When saving a high score succeeds", () => {

		beforeEach(async () => {
			mockOKResponse = {
				status: 200,
				data: {
					message: ""
				}
			}

			axios = Spy()
				.onMethod("post", null, mockOKResponse)

			highscoreService = new HighscoreService(axios)

			data = {
				username: "User",
				displayTime: "00:45:938",
				accuracy: "56%",
				wpm: "78"
			}

			response = await highscoreService.save(data)
		})

		it("Should make one POST request", () => {
			expect(axios.post.calls.length === 1).to.be.true
		})

		it("Should reach '/api/highscore/save'", () => {
			expect(axios.post.calls[0][0].includes("/api/highscore/save")).to.be.true
		})

		it("Should set the body of the request to the data it was provided", () => {
			expect(axios.post.calls[0][1] === data).to.be.true
		})

		it("Should return a message", () => {
			expect(response.message).to.exist
		})

		it("Should not return an error", () => {
			expect(response.error).to.not.exist
		})
	})

	describe("When saving a high score fails", () => {

		beforeEach(async () => {
			mockNotOKResponse = {
				status: 400,
				data: {
					error: ""
				}
			}

			axios = Spy()
				.onMethod("post", null, mockNotOKResponse)

			highscoreService = new HighscoreService(axios)

			data = {
				username: "User",
				displayTime: "00:45:938",
				accuracy: "56%",
				wpm: "78"
			}

			response = await highscoreService.save(data)
		})

		it("Should make one POST request", () => {
			expect(axios.post.calls.length === 1).to.be.true
		})

		it("Should reach '/api/highscore/save'", () => {
			expect(axios.post.calls[0][0].includes("/api/highscore/save")).to.be.true
		})

		it("Should set the body of the request to the data it was provided", () => {
			expect(axios.post.calls[0][1] === data).to.be.true
		})

		it("Should return an error", () => {
			expect(response.error).to.exist
		})

		it("Should not return a message", () => {
			expect(response.message).to.not.exist
		})
	})

	describe("When fetching all highscores", () => {
		beforeEach(async () => {
			mockOKResponse = {
				status: 200,
				data: {
					results: []
				}
			}

			axios = Spy()
				.onMethod("get", null, mockOKResponse)

			highscoreService = new HighscoreService(axios)

			response = await highscoreService.fetchAll()
		})

		it("Should make one GET request", () => {
			expect(axios.get.calls.length === 1).to.be.true
		})

		it("Should reach '/api/highscore/fetchAll'", () => {
			expect(axios.get.calls[0][0].includes("/api/highscore/fetchAll")).to.be.true
		})

		it("Should return a list", () => {
			expect(response).to.be.an.instanceOf(Array)
		})
	})
})
