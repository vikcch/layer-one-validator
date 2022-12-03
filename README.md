# layer-one-validator

Some _expressjs middleware_ callback functions to validate data from requests, checks the amount of properties, their types and the business logic.

## Installation and Usage

### Server-side usage

Install the library with: 

`npm install layer-one-validator`

The _validator_ should be called using the `bind()` method. The first and only _argument_ could be an `object` or an `array`.

> NOTE:: If the value to be tested is an _array_, the `type:function` must be tested against each element of that `array`, for the `biz:function` it could be tested against the whole `array` or against each element.

### Syntax

`layerOneValidator.body.bind(object)`

`layerOneValidator.body.bind(objectsArray)`

### Object

`{ prop:string [, type:function][, biz:function] }`

`{ prop:string [, type:function][, biz:function] }[]`

* prop <_string_> - The name of the property named on the request.

* type <_function_> - Optional, a function to test the type of the property. Should return a `boolean`.

* biz <_function_> - Optional, a function to test the business part of the property.
Should return a `boolean`.

### Body, Query or Params

The _layer-one-validator_ is an object with 3 properties, `'body'`,`'params'` and `'query'`, representing each _express request_.

### Responses

When fails, the response will be an _json_ object, with some properties:

* `{ success: false }` - Will throw an error with more information.

* `{ /* ... */, message }` - Shows the stage where the fails happened.

* `{ /* ... */, fail }` - Shows the fail property name, useful on arrays.

If successful, will go to the next _middleware_.

### CommonJS modules

```js
// controller
const layerOneValidator = require('layer-one-validator');

module.exports = {

    xxx: {
        layerOne: layerOneValidator.body.bind([
            { prop: 'id', type: v => Number.isInteger(v), biz: v => v > 0 },
            { prop: 'username', biz: v => /^[a-z]{4,8}$/.test(v) }
        ]),

        execute(req, res, next) {
            /* ... */
        }
    }
};
```

### ES6 modules

```js
// controller
import layerOneValidator from 'layer-one-validator';

export default {

    xxx: {
        layerOne: layerOneValidator.body.bind([
            { prop: 'id', type: v => Number.isInteger(v), biz: v => v > 0 },
            { prop: 'username', biz: v => /^[a-z]{4,8}$/.test(v) }
        ]),

        execute(req, res, next) {
            /* ... */
        }
    }
};
```

## Tests

Tests are using _mocha_, to run the tests use:

`$ npm test`

## Example of an express application

The directory [example](https://github.com/vikcch/layer-one-validator/tree/master/example) on the _github_ repository has simple sample project with the MVC pattern with the use of _layer-one-validator_:

* Clone the project:

    `git clone -b example https://github.com/vikcch/layer-one-validator.git`

* Change to the created directory _layer-one-validator_

    `cd layer-one-validator`

* Install necessary packages:

    `npm install`

* Run the project:

    `npm run start`

* Navigatate to:

    `http://127.0.0.1:8080/`

## License

Licensed under the [MIT](./LICENSE)