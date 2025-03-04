# layer-one-validator

Some _expressjs middleware_ callback functions to validate data from requests, checks the amount of properties, their types and the business logic.

## Installation and Usage

### Server-side usage

Install the library with: 

`npm install layer-one-validator`

The _validator_ should be invoked using the `bind()` method. The first and only _argument_ can be either an `object` or an `array`.

> NOTE:: If the value being tested is an _array_, the `type:function` must be evaluated for each element within that array. In the case of the `biz:function`, testing can be performed on the entire array or on each individual element.

### Syntax

`layerOneValidator.body.bind(object)`

`layerOneValidator.body.bind(objectsArray)`

### Object

`{ prop:string [, type:function][, biz:function][, optional:boolean] }`

`{ prop:string [, type:function][, biz:function][, optional:boolean] }[]`

* prop <_string_> - The name of the property named on the request.

* type <_function_> - Optional, a function to test the type of the property. Should return a `boolean`.

* biz <_function_> - Optional, a function to test the business part of the property.
Should return a `boolean`.

* optional <_boolean_> - Optional, default: `false`. When `optional` is set to `true` and the property exists on the incoming request, it must pass validation if a `type` or `biz` rule is defined.

### Body, Query or Params

The _layer-one-validator_ is an object with 3 properties, `'body'`,`'params'` and `'query'`, representing each _express request_.

> NOTE:: The `Content-Type` must be set to `application/json` when the data is sent in the body of the request.

### Responses

If validation fails, the response will be a JSON object containing:

* `{ success: false }` - Will throw an error on the server with additional information.

* `{ /* ... */, message }` - Indicates the stage at which the failures occurred.

* `{ /* ... */, fail }` - Displays the name of the failing property.

* `{ /* ... */, layer }` - Displays `'body'`,`'params'` or `'query'`.

* `{ /* ... */, source }` - Displays the source as `layer-one-validator`.

If successful, will go to the next _middleware_.

### HTTP response status codes

If the bound _object_ or _objectsArray_ is incorrect, or if the `type` property function checks the entire array instead of individual items:

* `500 Internal Server Error` 

When issues are found with prop, type, or there are discrepancies in the number of properties:

* `400 Bad Request`

When fails on _biz_:

* `422 Unprocessable Content`

### Route only

```js
// route
const layerOneValidator = require('layer-one-validator');

router.post('/user',

    layerOneValidator.body.bind([
        { prop: 'weight', type: v => Number.isInteger(v), biz: v => v > 0 },
        { prop: 'username', biz: v => /^[a-z]{4,8}$/.test(v) }
    ]),

    (request, response, next) => {
        /* ... */
    }
);

module.exports = router;
```

### Route & Helpers & Controller

```js
// route
const userController = require(/* ... */);

router.post('/user',
    userController.user.validation.layerOne,
    userController.user.execute
);
```
```js
// helpers - fns.js
module.exports = {
    isNumber: value => typeof value === 'number',
    isString: value => typeof value === 'string'
};

// helpers - biz.js
module.exports = {
    isWeight: value => Number.isInteger(value) && value > 0,
    isUsername: value => /^[a-z]{4,8}$/.test(value)
};
```
```js
// controller
const layerOneValidator = require('layer-one-validator');
const fns = require('./path_to_helpers/fns');
const biz = require('./path_to_helpers/biz');

module.exports = {

    // * POST
    user: {

        validation: {
            layerOne: layerOneValidator.body.bind([
                { prop: 'weight', type: fns.isNumber, biz: biz.isWeight },
                { prop: 'username', type: fns.isString, biz: biz.isUsername }
            ])
        },

        execute(request, response, next) {
            /* ... */
        }
    }
};
```

## Tests

Tests are using _mocha_, to run the tests use:

`$ npm test`

Conducts tests without displaying _layer-one-validator_ helper errors in the console.

`$ npm run test-no-print-error`

## License

Licensed under the [MIT](./LICENSE)