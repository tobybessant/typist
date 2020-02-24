import { expect } from "chai"
import { shallowMount } from "@vue/test-utils"
import NewGame from "@/views/NewGame.vue"

describe("NewGame View", () => {
	let wrapper

	beforeEach(() => {
		wrapper = shallowMount(NewGame, {})
	})

	afterEach(() => {
		wrapper = null
	})

	it("Renders the page heading 'New Game'", () => {
		expect(wrapper.html()).to.contain("New Game")
	})

	it("Is a heading 1", () => {
		expect(wrapper.html()).to.contain("h1")
	})

	it("Has one input", () => {
		const inputField = /<input.*?>/g
		expect((wrapper.html().match(inputField) || []).length).to.equal(1)
	})

	it("Has one text input", () => {
		const inputFieldText = /<input.*?type="text".*?>/g
		expect((wrapper.html().match(inputFieldText) || []).length).to.equal(1)
	})

	it("Has one text input with placeholder text", () => {
		const inputFieldText = /<input.*?placeholder=".+?".*?>/g
		expect((wrapper.html().match(inputFieldText) || []).length).to.equal(1)
	})

	it("Has placeholder text of 'Enter Username'", () => {
		const inputFieldText = /<input.*?placeholder="Enter Username".*?>/g
		expect((wrapper.html().match(inputFieldText) || []).length).to.equal(1)
	})

	it("Has 2 router buttons", () => {
		const routerButton = /<button.*?<\/button.*?>/g
		expect((wrapper.html().match(routerButton) || []).length).to.equal(2)
	})
})
