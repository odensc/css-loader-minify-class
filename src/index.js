"use strict";

const allowedCharactersFirst = "abcdefhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const allowedCharactersAfter = allowedCharactersFirst + "0123456789-_";

class Minifier {
	constructor() {
		this.idents = new Map();
		this.indexes = [0];

		// Fix scope when called by css-loader.
		this.getLocalIdent = this.getLocalIdent.bind(this);
	}

	getNextIdent(key) {
		const { idents, indexes } = this;
		const usedIdents = Array.from(this.idents.values());
		let ident = "";

		do {
			ident = indexes
				.map((i, arrIndex) => {
					// Limit the index for allowedCharactersFirst to it's maximum index.
					const maxIndexFirst = Math.min(i, allowedCharactersFirst.length - 1);

					return arrIndex === 0 ? allowedCharactersFirst[maxIndexFirst] : allowedCharactersAfter[i]
				})
				.join("");

			let i = indexes.length;
			while (i--) {
				indexes[i] += 1;

				if (indexes[i] === allowedCharactersAfter.length) {
					indexes[i] = 0;

					if (i === 0) indexes.push(0);
				} else break;
			}
		} while (usedIdents.includes(ident));

		idents.set(key, ident);
		return ident;
	}

	getLocalIdent(context, _, localName) {
		const key = [context.resourcePath, localName].join("-");

		return this.idents.get(key) || this.getNextIdent(key);
	}
}

const createMinifier = () => new Minifier().getLocalIdent;

module.exports = createMinifier;
module.exports.Minifier = Minifier;
