"use strict";

const createMinifier = require("../");
const { Minifier } = createMinifier;

describe("Minifier", () => {
	let min;
	beforeEach(() => min = new Minifier());

	describe("idents", () => {
		it("should be empty", () => {
			expect(min.idents.size).toEqual(0);
		});
	});

	describe("indexes", () => {
		it("should have an initial element of 0", () => {
			expect(min.indexes).toEqual([0]);
		});
	})

	describe("options", () => {
		it("should set options given to constructor", () => {
			const options = { blacklist: ["test"] };
			min = new Minifier(options);
			expect(min.options).toEqual(options);
		});
	})

	describe("getLocalIdent", () => {
		it("should return a new name if key is not in idents map", () => {
			expect(min.getLocalIdent({ resourcePath: "test" }, null, "test")).toEqual("a");
		});

		it("should return the same name if key is the same", () => {
			min.getLocalIdent({ resourcePath: "test" }, null, "test");
			expect(min.getLocalIdent({ resourcePath: "test" }, null, "test")).toEqual("a");
		});

		it("should return a prefixed name", () => {
			min = new Minifier({ prefix: ["menu_"] });
			expect(min.getLocalIdent({ resourcePath: "test" }, null, "test1")).toEqual("menu_a");
			expect(min.getLocalIdent({ resourcePath: "test" }, null, "test2")).toEqual("menu_b");
		});
	});

	describe("getNextIdent", () => {
		it("shouldn't return any names that are in the blacklist", () => {
			min = new Minifier({ blacklist: [/^a$/, "b"] });
			const names = [];
			for (let i = 0; i < 3; i++) {
				names.push(min.getNextIdent(i));
			}

			expect(names).not.toContain("a");
			expect(names).not.toContain("b");
		});

		it("shouldn't return any duplicates after 2,000 runs", () => {
			const names = [];
			for (let i = 0; i < 2000; i++) {
				names.push(min.getNextIdent(i));
			}

			expect(new Set(names).size).toEqual(names.length);
		});
	});
});

describe("createMinifier", () => {
	it("should return getLocalIdent", () => {
		expect(createMinifier().name).toMatch("getLocalIdent");
	});
});
