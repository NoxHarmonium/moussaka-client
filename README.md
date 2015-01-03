moussaka-client
==================

#### A javascript library that allows you to use javascript applications with the [Moussaka](https://github.com/NoxHarmonium/moussaka) prototyping framework.

[![Build Status](https://travis-ci.org/NoxHarmonium/moussaka-client.svg?branch=master)](https://travis-ci.org/NoxHarmonium/moussaka-client) [![Coverage Status](https://img.shields.io/coveralls/NoxHarmonium/moussaka-client.svg)](https://coveralls.io/r/NoxHarmonium/moussaka-client?branch=master)


#### Usage Example
```javascript
  // Instantiate client
  var client = new MoussakaClient(opts);

  // Auto detect variable type
  var aNumber = client.registerVar('aNumber', 5);
  var aString = client.registerVar('aString', 'string beans');
  var aColor  = client.registerVar('aColor', new MoussakaClient.types.Color(1, 0, 0, 1)); // Moussaka type

  // Define specific schema
  var validatedNumber = client.registerVar('validatedNumber', 5, {
    type: 'float',
    min: 0,
    max: 100
  });

  // Start polling
  client.connect();

  while(running) {
    // Use Moussaka to adjust variables, MoussakaClient will poll for updates
    // and update the values accordingly.

    console.log(aNumber.value);
    console.log(aNumber.aString);
    console.log(aNumber.aColor.toString());
    console.log(aNumber.validatedNumber);
  }

  // Stop polling afterwards
  client.disconnect();
```

#### Options

To instantiate MoussakaClient you must pass in an object with the following keys.

| Option            | Desciption                                                                                    | Default                 |
| ----------------- |-----------------------------------------------------------------------------------------------|-------------------------|
| deviceName        | The name of the device (i.e. John Smith's PC.)                                                | None                    |
| apiKey            | The user API key retreived from the user account settings in Moussaka.                        | None                    |
| projectId         | The project ID retreived from the project view page in Moussaka.                              | None                    |
| projectVersion    | A string specifying the particular version of the project that this library is used in.       | None                    |
| serverUrl         | The url to your Moussaka server.                                                              | http://localhost:3000/  |
| pollInterval      | The time in milliseconds between each poll to the server.                                     |    1000                 |
| logLevel          | See section below.                                                                            | 2 (warning)             |

#### Installing

It can be used directly in a node application or in the browser.

##### In Node:

- Install the package through npm

```bash
npm install moussaka-client
```

- Load the module

```javascript
var MoussakaClient = require('moussaka-client');
var client = new MoussakaClient(opts);
```

##### In The Browser:
There are a few ways you can use it in the browser:

Get the package through bower:
```bash
bower install moussaka-client
```
The library bundle will be accessible at '/bower_components/moussaka-client/dist/moussaka-client[.min].js'.
Then choose your favourite way to load up the module:

- Consume it with CommonJS
```javascript
var MoussakaClient = require('/path/to/moussaka-client.js');
```
- Consume it with RequireJS
```html
<script src="require.js"></script>
<script src="/path/to/moussaka-client.js"></script>
```
```javascript
require('moussaka-client.js', function (MoussakaClient) {
  var client = new MoussakaClient(opts);
});
```
- Just use it as a global on the window object
```html
<script src="/path/to/moussaka-client.js"></script>
```
```javascript
var client = new MoussakaClient(opts);
```

- You could also just use the npm module in node and use Browserify to build your node application for the browser.

#### Log Level

By passing in a logLevel option you can control the detail of the log messages. The log levels are as follows:

- trace: 0
- info: 1
- warning: 2
- error: 3
- exception: 4

For example, to see only messages that are errors or exceptions, you would pass { logLevel: 3 } to the MoussakaClient constructor.






