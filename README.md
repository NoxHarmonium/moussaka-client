moussaka-client-js
==================

#### A javascript library that allows you to use javascript applications with the [Moussaka](https://github.com/NoxHarmonium/moussaka) prototyping framework.

<!---

#### Options


WIP:Options table


| Parameter         | Are           | Cool  |
| ----------------- |:-------------:| -----:|
| deviceName        | right-aligned | $1600 |
| apiKey            | centered      |   $12 |
| projectId         | are neat      |    $1 |
| projectVersion    | are neat      |    $1 |
| serverUrl         | are neat      |    $1 |
| pollInterval      | are neat      |    $1 |

-->

#### Installing

It can be used directly in a node application or in the browser as a global object.

##### In Node:

- Install the package through npm

```bash
npm install moussaka-client-js
```

- Load the module

  ```javascript
  var MoussakaClient = require('moussaka-client-js');
  var client = new MoussakaClient(opts);
  ```

##### In The Browser:

- Install the package through bower. 
```bash
bower install moussaka-client-js
```
The minified and non minified file will be accessable at '/bower_components/moussaka-client-js/dist/'. Then choose your favourite way to load up the module:

- Use browserify and the node module.
- Consume it with CommonJS
```javascript
var MoussakaClient = require('moussaka-client-js.js');
```
- Consume it with RequireJS
```html
<script src="require.js"></script>
<script src="moussaka-client-js.js"></script>
```
```javascript
require('moussaka-client-js.js', function (MoussakaClient) {
  var client = new MoussakaClient(opts);
});
```
- Just use it as a global on the window object
```html
<script src="moussaka-client-js.js"></script>
```
```javascript
var client = new MoussakaClient(opts);
```



