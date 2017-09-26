# css-loader-minify-class

* [Usage](#usage)
* [API](#api)
* [Options](#options)
* [Help](#help)

*Just want to use it? [Click here.](#usage)*

---

Minify class names when using CSS Modules with css-loader.

(best paired with `minimize: true`)

**What does it do again?**

It minifies your CSS Module class names using the highest-quality algorithm available on the market.

Or, you could say it turns this:

```css
.container {
    display: flex;
    height: 100vh;
}

.button {
    border-radius: 2px;
}
```

Into this:

```css
.a {
    display: flex;
    height: 100vh;
}

.b {
    border-radius: 2px;
}
```

## Usage

To use it, import the module and then set `getLocalIdent` in css-loader's options to `createMinifier()`.

For a simple example, see the following code.

```js
const createMinifier = require("css-loader-minify-class");

module.exports = {
  module: {
    rules: {
      {
        loader: "css-loader",
        options: {
          // make sure to add this
          ident: "css",
          // development class name here
          localIdentName: "[name]_[local]-[hash:2]",
          // these should only be in your production config
          minimize: true,
          getLocalIdent: createMinifier()
        }
      },

      [...]
    }
  }

  [...]
};
```

## API

The module exports a function.

### createMinifier(options?: object) -> Function

Takes an optional parameter `options`. [See the options here.](#options)

Returns a function.

## Options

Any options can be passed to `createMinifier` as an object.

* **blacklist**
	* An array of `RegExp | string`. If a class name includes/matches any of them, it will be skipped.
	* *default: [/^ad$/]* - to prevent confusing adblockers
* **prefix**
  * A prefix for the class name. For example, `menu_`.

## Help

Ran into a bug or just have a question? [Create a new issue!](https://github.com/odensc/css-loader-minify-class/issues)
