import { expect } from "chai"
import { shallowMount } from "@vue/test-utils"
import JoinGame from "@/views/JoinGame.vue"

describe("JoinGame View", () => {
	let wrapper

	beforeEach(() => {
		wrapper = shallowMount(JoinGame, {})
	})

	afterEach(() => {
		wrapper = null
	})

	it("Renders the page heading 'Join Game'", () => {
		expect(wrapper.html()).to.contain("Join Game")
	})

	it("Is a heading 1", () => {
		expect(wrapper.html()).to.contain("h1")
	})

	it("Has two inputs", () => {
		const inputField = /<input.*?>/g
		expect((wrapper.html().match(inputField) || []).length).to.equal(2)
	})

	it("Has two text inputs", () => {
		const inputFieldText = /<input.*?type="text".*?>/g
		expect((wrapper.html().match(inputFieldText) || []).length).to.equal(2)
	})

	it("Has two text inputs with placeholder text", () => {
		const inputFieldText = /<input.*?placeholder=".+?".*?>/g
		expect((wrapper.html().match(inputFieldText) || []).length).to.equal(2)
	})

	it("One has placeholder text of 'Enter Username'", () => {
		const inputFieldText = /<input.*?placeholder="Enter Username".*?>/g
		expect((wrapper.html().match(inputFieldText) || []).length).to.equal(1)
	})

	it("One has placeholder text of 'Lobby Code'", () => {
		const inputFieldText = /<input.*?placeholder="Enter Lobby Code".*?>/g
		expect((wrapper.html().match(inputFieldText) || []).length).to.equal(1)
	})

	it("Has 2 buttons", () => {
		const routerButton = /<button.*?<\/button.*?>/g
		expect((wrapper.html().match(routerButton) || []).length).to.equal(2)
	})
})
