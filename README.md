moussaka-client-js
==================

## A javascript library that allows you to use javascript applications with the [Moussaka](https://github.com/NoxHarmonium/moussaka) prototyping framework.

It can be used directly in a node application or in the browser as a global object.

#### In Node:

Install the package through npm

```bash
npm install moussaka-client-js
```

Load it in node

```javascript
var MoussakaClient = require('moussaka-client-js');
var client = new MoussakaClient(opts);
```

#### In The Browser:

Install the package through bower

```bash
bower install moussaka-client-js
```

Then choose your favourite way to load up the module

1. Use browserify and the node module.

2. Consume it with CommonJS

```javascript
var MoussakaClient = require('moussaka-client-js.js');
```
3. Consume it with RequireJS
```html
<script src="require.js"></script>
<script src="moussaka-client-js.js"></script>
```

```javascript
require('moussaka-client-js.js', function (MoussakaClient) {
  var client = new MoussakaClient(opts);
});
```
4. Just use it as a global on the window object
```html
<script src="moussaka-client-js.js"></script>
```

```javascript
var client = new MoussakaClient(opts);
```



