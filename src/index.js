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
		const usedIdents = Array.from(this.idents.values());
		let ident = "";

		do {
			ident = this.indexes
				.map((i, arrIndex) => {
					// Limit the index for allowedCharactersFirst to it's maximum index.
					const maxIndexFirst = Math.min(i, allowedCharactersFirst.length - 1);

					return arrIndex === 0 ? allowedCharactersFirst[maxIndexFirst] : allowedCharactersAfter[i]
				})
				.join("");

			let i = this.indexes.length;
			while (i--) {
				this.indexes[i] += 1;

				if (this.indexes[i] === allowedCharactersAfter.length) {
					this.indexes[i] = 0;

					if (i === 0) this.indexes.push(0);
				} else break;
			}
		} while (usedIdents.includes(ident));

		this.idents.set(key, ident);
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
