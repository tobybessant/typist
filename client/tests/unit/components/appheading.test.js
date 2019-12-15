import { expect } from "chai"
import { shallowMount } from "@vue/test-utils"
import AppHeading from "@/components/AppHeading.vue"

describe("AppHeading component", () => {
	let wrapper

	beforeEach(() => {
		wrapper = shallowMount(AppHeading, {})
	})

	afterEach(() => {
		wrapper = null
	})

	it("Renders the app heading 'Typist'", () => {
		expect(wrapper.html()).to.contain("Typist")
	})

	it("Is a heading 1", () => {
		expect(wrapper.is("h1"))
	})
})
