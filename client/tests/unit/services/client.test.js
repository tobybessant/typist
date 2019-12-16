/* eslint-disable no-unused-expressions */

import { expect } from "chai"
import Spy from "../../../../server/test/utilities/spy"
import Client from "../../../src/services/Client"

describe("Client service", () => {
	// eslint-disable-next-line no-unused-vars
	let socket, username, lobbyCode, client

	beforeEach(() => {
		socket = Spy()
			.onMethod("on")
			.onMethod("emit")
	})

	afterEach(() => {
		socket = null
		username = null
		lobbyCode = null
	})

	describe("Registers required message handlers when initialised", () => {
		beforeEach(() => {
			username = "Toby"
			lobbyCode = "HASN"
			client = new Client(socket, username, lobbyCode)
		})

		it("Registers 'STATE_UPDATE' event handler", () => {
			let calledWithStateUpdate = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("STATE_UPDATE")) {
					calledWithStateUpdate = true
					return
				}
				return
			}
			expect(calledWithStateUpdate).to.be.true
		})

		it("Registers 'STATE_UPDATE' event handler with a callback", () => {
			let stateUpdateHasCallback = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("STATE_UPDATE")) {
					for (let j = 0; j < call[i].length; j++) {
						const arg = call[i][j]
						if (typeof arg === "function") {
							stateUpdateHasCallback = true
							return
						}
					}
				}
				return
			}
			expect(stateUpdateHasCallback).to.be.true
		})

		it("Registers 'SELF' event handler", () => {
			let calledWithStateUpdate = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("SELF")) {
					calledWithStateUpdate = true
					return
				}
				return
			}
			expect(calledWithStateUpdate).to.be.true
		})

		it("Registers 'SELF' event handler with a callback", () => {
			let stateUpdateHasCallback = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("SELF")) {
					for (let j = 0; j < call[i].length; j++) {
						const arg = call[i][j]
						if (typeof arg === "function") {
							stateUpdateHasCallback = true
							return
						}
					}
				}
				return
			}
			expect(stateUpdateHasCallback).to.be.true
		})

		it("Registers 'disconnect' event handler", () => {
			let calledWithStateUpdate = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("disconnect")) {
					calledWithStateUpdate = true
					return
				}
				return
			}
			expect(calledWithStateUpdate).to.be.true
		})

		it("Registers 'disconnect' event handler with a callback", () => {
			let stateUpdateHasCallback = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("disconnect")) {
					for (let j = 0; j < call[i].length; j++) {
						const arg = call[i][j]
						if (typeof arg === "function") {
							stateUpdateHasCallback = true
							return
						}
					}
				}
				return
			}
			expect(stateUpdateHasCallback).to.be.true
		})
	})

	describe("Identifies if the client is creating or joining a lobby based on the lobby code", () => {

		beforeEach(() => {
			username = "Toby"
			client = new Client(socket, username, lobbyCode)
		})

		describe("Creates a lobby when the lobby code is falsy", () => {
			beforeEach(() => {
				lobbyCode = null
			})

			it("socket.emit() is called once", () => {
				expect(socket.emit.calls.length).to.equal(1)
			})

			it("was called with 'CREATE_LOBBY'", () => {
				expect(socket.emit.calls[0][0]).to.equal("CREATE_LOBBY")
			})
		})

		describe("Joins a lobby when the lobby code is truthy", () => {
			beforeEach(() => {
				lobbyCode = "AAAA"
			})

			it("socket.emit() is called once", () => {
				expect(socket.emit.calls.length).to.equal(1)
			})

			it("was called with 'JOIN_LOBBY'", () => {
				expect(socket.emit.calls[0][0]).to.equal("CREATE_LOBBY")
			})
		})
	})

	describe("The stateChange() method emits the correct events", () => {
		beforeEach(() => {
			username = "Toby"
			lobbyCode = "HASN"
			client = new Client(socket, username, lobbyCode)

			socket.reset()

			client.stateChange()
		})

		it("socket.emit() is called once", () => {
			expect(socket.emit.calls.length).to.equal(1)
		})

		it("was called with 'PLAYER_STATE_UPDATE'", () => {
			expect(socket.emit.calls[0][0]).to.equal("PLAYER_STATE_UPDATE")
		})
	})

	describe("The toggleReady() method performs its function", () => {
		beforeEach(() => {
			username = "Toby"
			lobbyCode = "HASN"
			client = new Client(socket, username, lobbyCode)

			socket.reset()
		})

		it("The client ready state is switched", () => {
			let originalState = client.details.isReady
			client.toggleReady()

			expect(client.details.isReady).to.equal(!originalState)
		})

		it("socket.emit() is called once", () => {
			client.toggleReady()
			expect(socket.emit.calls.length).to.equal(1)
		})

		it("socket.emit() was called with 'PLAYER_STATE_UPDATE'", () => {
			client.toggleReady()
			expect(socket.emit.calls[0][0]).to.equal("PLAYER_STATE_UPDATE")
		})
	})
})
