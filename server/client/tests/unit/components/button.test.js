import { expect } from "chai"
import { shallowMount } from "@vue/test-utils"
import Button from "@/components/Button.vue"

describe("Button component", () => {
	let wrapper, label, route

	beforeEach(() => {
		label = "Home"
		wrapper = shallowMount(Button, {
			propsData: {
				label,
				route
			}
		})
	})

	afterEach(() => {
		wrapper = null
	})

	it("Should have a label value", () => {
		expect(wrapper.props().label).to.equal(label)
	})

	it("Should have a 'button' class", () => {
		expect(wrapper.is(".button"))
	})

	it("Should have a 'button:hover' class", () => {
		expect(wrapper.is(".button:hover"))
	})
})
