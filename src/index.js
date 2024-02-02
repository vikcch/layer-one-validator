'use strict';

// NOTE:: Status codes - Client erros
// https://docs.github.com/en/rest/overview/resources-in-the-rest-api#client-errors

const source = 'layer-one-validator';
const message_500 = 'If you own the server, check the logs';

const failMessages = {
    base: {
        fields: 'input-fields :: Miss match',
        type: 'input-types',
        biz: 'biz',
    },
    append: {
        array: 'Tip: Test the item, not the array.',
    },
    source,
    message_500
};

/**
 * Aceita props como `...array` ou uma/varias strings
 * @param {object} object 
 * @param  {...string} props ...Array ou `stringA`, `stringB`
 * @returns 
 */
const hasAllProperties = function (object, ...props) {

    if (Object.keys(object).length !== props.length) return false;

    const hopObject = Object.prototype.hasOwnProperty.bind(object);

    return props.every(prop => hopObject(prop));
};

const makeRequestProp = function (req) {

    const requestProps = ['body', 'params', 'query'];

    if (this.requestProp && !requestProps.includes(this.requestProp)) {

        throw new Error('`requestProp` must be "body" or "params"');
    }

    const requestProp = req[this.requestProp] ?? req.body;

    return requestProp;
};

const fields = function () {

    return (req, res, next) => () => {

        const props = this.data.map(v => v.prop);

        const hasAllProps = hasAllProperties(this.reqProp, ...props);

        if (hasAllProps) return next();

        const expected = Array.isArray(this.data) ? this.data : [this.data];
        const actual = { ...this.reqProp };

        const missing = expected.filter(v => !(v.prop in actual)).map(v => v.prop);
        const extra = Object.keys(actual).filter(v => !expected.some(vv => vv.prop === v));

        const fail = { missing, extra };

        const layer = this.requestProp;

        res.status(400).json({ success: false, message: failMessages.base.fields, fail, layer, source });
    }
};

const type = function () {

    return (req, res, next) => () => {

        const tests = this.data.map(({ prop, type: fn }) => {

            if (!fn) return { test: true };
            const value = this.reqProp[prop];
            const arr = Array.isArray(value) ? value : [value];

            // NOTE:: Até à v0.2.0 verificava se testava contra o item do array...
            // Em v0.3.0+ retorna 500, validado em `checkTypeAgainstItemValidator()`
            // file:///C:\Users\vik\Dropbox\dev\minor\layer-one-validator\_sketch\_old-type.js

            // NOTE:: "[].every()" retorna `true` em empty array
            return { prop, test: [...arr].every(fn) && !!arr.length };
        });

        if (tests.every(v => v.test)) return next();

        const fail = tests.find(v => !v.test).prop;

        const message = failMessages.base.type;

        const layer = this.requestProp;

        res.status(400).json({ success: false, message, fail, layer, source });
    }
};

const biz = function () {

    let message = failMessages.base.biz;

    return (req, res, next) => () => {

        const tests = this.data.map(({ prop, biz: fn }) => {

            if (!fn) return { test: true };
            const value = this.reqProp[prop];
            const arr = Array.isArray(value) ? value : [value];

            if (Array.isArray(value)) {

                if (fn(value)) return { prop, test: true };
            }

            // NOTE:: "[].every()" retorna `true` em empty array
            return { prop, test: [...arr].every(fn) && !!arr.length };
        });

        if (tests.every(v => v.test)) return next();

        const fail = tests.find(v => !v.test).prop;

        const layer = this.requestProp;

        res.status(422).json({ success: false, message, fail, layer, source });
    }
};

const tryPrintError = error => {

    if (process.argv[5] === 'no-print-error') return;

    const reset = '\x1b[0m';
    const fgRed = '\x1b[31m';

    const message = `${fgRed}${error.message}${reset}`;

    const repo = 'https://github.com/vikcch/layer-one-validator';
    const help = `\n➡ Check the documentation at: ${repo}`
    console.error(error.name, '❌ layer-one-validator #', message, help);
};

/**
 * The `type` property must be checked against the item, not the array
 * 
 * @param { { prop:string, type:function, biz:function }[] } data 
 * @returns 
 */
const checkTypeAgainstItemValidator = data => {

    const hasType = value => Object.keys(value).includes('type');

    const types = ['', 0, false, {}];

    const fail = data.find(v => hasType(v) && types.every(vv => !v.type(vv)));

    if (fail) {
        const lines = [
            `Ensure that the 'type' property of '${fail.prop}' is checked for its type.`,
            "For example: `type: v => typeof v === 'string'`",
            'Hint: Perform the test on the individual item, not the entire array.'
        ];
        throw new Error(lines.join('\n'));
    }
};


/**
 * 
 * @param { { prop:string, type:function, biz:function }[] } data 
 * @returns 
 */
const dataValidator = data => {

    const propFail = data.find(v => !v.prop || typeof v.prop !== 'string');

    if (propFail) {

        const message = propFail.prop
            ? `The 'prop' property of '${propFail.prop}' must be a string`
            : `The 'prop' property is mandatory`;

        throw new Error(message);
    }

    const typeFail = data.find(v => Object.keys(v).includes('type') && typeof v.type !== 'function');

    if (typeFail) {

        throw new Error(`The 'type' property of '${typeFail.prop}' must be a function`);
    }

    checkTypeAgainstItemValidator(data);

    const bizFail = data.find(v => Object.keys(v).includes('biz') && typeof v.biz !== 'function')

    if (bizFail) {

        throw new Error(`The 'biz' property of '${bizFail.prop}' must be a function`);
    }
};

const arrayValidator = mixArray => {

    const extraPropsCount = !!mixArray.requestProp | 0;

    // NOTE:: Não copia properties de "mix array/object" (.requestProp)
    const array = mixArray.slice();
    const alloweds = ['prop', 'type', 'biz'];
    const keys = Object.keys(mixArray);

    if (keys.length !== array.length + extraPropsCount) {

        throw new Error('Prohibited properties. Allowed: `prop` (mandatory), `type` and `biz` (optional).');
    }

    const isDirty = array.some(item => {
        const itemKeys = Object.keys(item);
        return itemKeys.some(v => !alloweds.includes(v));
    });

    if (isDirty) {

        throw new Error('Prohibited properties. Allowed: `prop` (mandatory), `type` and `biz` (optional).');
    }
};

const requestValidator = (requestProp, req) => {

    if (req.prop) throw new Error('Multiple properties must be on an array');

    if (requestProp !== 'body') return;

    if (process.env.TEST === 'LOV') return;

    // NOTE:: key / field names are case-insensitive 
    // https://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2

    const contentType = req.headers['content-type']?.toLowerCase();

    // NOTE:: Pode ter `charset=utf-8` no inicio ou fim
    if (!contentType.includes('application/json')) {

        throw new Error(`Set the headers { 'Content-Type': 'application/json' } `);
    }
};

/**
 * 
 * @param { (object|array) } value Pode ser "mixArray" - array com props
 */
const thisValidator = (value) => {

    const removeRequestProp = (value) => {

        if (Array.isArray(value)) return value.slice();

        const { requestProp, ...target } = value
        return target;
    };

    const target = removeRequestProp(value);

    if (!target) {

        throw new Error('An `object` must be provided to the bind function');
    }

    const alloweds = ['prop', 'type', 'biz'];
    const keys = Object.keys(target);

    if (!Array.isArray(target) && keys.some(v => !alloweds.includes(v))) {
        throw new Error('Prohibited properties. Allowed: `prop` (mandatory), `type` and `biz` (optional).');
    }

    if (Array.isArray(target)) arrayValidator(value);
};

/**
 * @summary  
 * This function is used along with _expressjs_ as a _middleware_ to validate 
 * data from requests, should be called using the `bind()` method. The 
 * first and only _argument_ could be an `object` or an `array`:  
 * 
 * `{ prop:string [, type:function][, biz:function] }`  
 * `{ prop:string [, type:function][, biz:function] }[]`  
 * 
 * An additional property `requestProp:string` could be provided, being `'body'`, 
 * `'params'` or `'query'`, when ommited, `'body'` will be the _default_.  
 * 
 * If the value to be tested is an _array_, the `type:function` must be tested
 * against each element of that `array`, for the `biz:function` it could be tested
 * against the whole `array` or against each element.
 * 
 * {@link} DOCUMENTATION: https://github.com/vikcch/layer-one-validator
 * 
 * @example
 * layerOneValidator.bind(Object.assign([
 *   {prop:'id', type: v => Number.isInteger(v), biz: v => v>0},    
 *   {prop:'username', biz: v => /^[a-z]{4,8}$/.test(v)}  
 * ]), { requestProp: 'body' });
 * 
 * @example
 * layerOneValidator.bind({prop:'id'})
 * 
 */
const start = function (req, res, next) {

    // NOTE:: Validações sem condicional, tem "throw" na function

    try {

        requestValidator(this.requestProp, req);

        thisValidator(this);

        const that = {
            reqProp: makeRequestProp.call(this, req),
            data: Array.isArray(this) ? this.slice() : [this],
            requestProp: this.requestProp  // layer
        };

        dataValidator(that.data);

        const absxs = [
            fields.call(that),
            type.call(that),
            biz.call(that),
        ];

        const run = absxs.reduceRight((acc, cur) => cur(req, res, acc), next);

        run();

    } catch (err) {

        tryPrintError(err);

        const layer = this.requestProp;

        res.status(500).json({ success: false, message: message_500, layer, source });
    }
};


/**
 * @summary  
 * Those callback functions are used along with _expressjs_ as a _middleware_ to 
 * validate data from requests, should be called using the `bind()` method. The 
 * first and only _argument_ could be an `object` or an `array`:  
 * 
 * `{ prop:string [, type:function][, biz:function] }`  
 * `{ prop:string [, type:function][, biz:function] }[]`  
 * 
 * If the value to be tested is an _array_, the `type:function` must be tested
 * against each element of that `array`, for the `biz:function` it could be tested
 * against the whole `array` or against each element.
 * 
 * {@link} DOCUMENTATION: https://github.com/vikcch/layer-one-validator
 * 
 * @property {object} object 
 * @property {function} object.body   - Express request.body
 * @property {function} object.params - Express request.params
 * @property {function} object.query  - Express request.query
 * 
 */
module.exports = {
    // export default {

    /**
     * {@link} DOCUMENTATION: https://github.com/vikcch/layer-one-validator
     * 
     * @example
     * layerOneValidator.body.bind([
     *  {prop: 'id', type: v => Number.isInteger(v), biz: v => v>0},
     *  {prop: 'username', biz: v => /^[a-z]{4,8}$/.test(v)}
     * ])
     * 
     * @example
     * layerOneValidator.body.bind({prop:'id'})
     */
    body(req, res, next) {

        // NOTE:: Aqui para não poluir o "exports"
        if (this === 'messages') return { failMessages };

        const binding = Object.assign(this || {}, { requestProp: 'body' });
        start.call(binding, req, res, next);
    },

    /**
     * {@link} DOCUMENTATION: https://github.com/vikcch/layer-one-validator
     * 
     * @example
     * layerOneValidator.params.bind([
     *  {prop: 'id', type: v => Number.isInteger(v), biz: v => v>0},
     *  {prop: 'username', biz: v => /^[a-z]{4,8}$/.test(v)}
     * ])
     * 
     * @example
     * layerOneValidator.params.bind({prop:'id'})
     */
    params(req, res, next) {

        const binding = Object.assign(this || {}, { requestProp: 'params' });
        start.call(binding, req, res, next);
    },
    /**
     * {@link} DOCUMENTATION: https://github.com/vikcch/layer-one-validator
     * 
     * @example
     * layerOneValidator.query.bind([
     *  {prop: 'id', type: v => Number.isInteger(v), biz: v => v>0},
     *  {prop: 'username', biz: v => /^[a-z]{4,8}$/.test(v)}
     * ])
     * 
     * @example
     * layerOneValidator.query.bind({prop:'id'})
     */
    query(req, res, next) {

        const binding = Object.assign(this || {}, { requestProp: 'query' });
        start.call(binding, req, res, next);
    }
};