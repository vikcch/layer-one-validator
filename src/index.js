'use strict';

const failMessages = {
    base: {
        fields: 'input-fields :: Fields missing',
        type: 'input-types',
        biz: 'biz',
    },
    append: {
        array: 'The function must test the item instead of the array',
    }
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

        res.json({ success: false, message: failMessages.base.fields });
    }
};

const type = function () {

    let message = failMessages.base.type;

    return (req, res, next) => () => {

        const tests = this.data.map(({ prop, type: fn }) => {

            if (!fn) return { test: true };
            const value = this.reqProp[prop];
            const arr = Array.isArray(value) ? value : [value];

            if (Array.isArray(value)) {

                message = `${message} :: ${failMessages.append.array}`;

                try {
                    // NOTE:: Dá erro quando aplica metodo de array em primitive
                    return { prop, test: [...arr].every(fn) };

                } catch (err) {

                    printError(err);
                    return { prop, test: false };
                }
            }

            return { prop, test: [...arr].every(fn) };
        });

        if (tests.every(v => v.test)) return next();

        const fail = tests.find(v => !v.test).prop;

        res.json({ success: false, message, fail });
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

            return { prop, test: [...arr].every(fn) };
        });

        if (tests.every(v => v.test)) return next();

        const fail = tests.find(v => !v.test).prop;

        res.json({ success: false, message, fail });
    }
};

const printError = error => {

    const repo = 'https://github.com/vikcch/layer-one-validator';
    const help = `\n➡ Check the documentation at: ${repo}`
    console.error(error.name, '❌ layer-one-validator #', error.message, help);
};

/**
 * 
 * @param { { prop:string, type:function, biz:function }[] } data 
 * @returns 
 */
const dataValidator = data => {

    if (data.some(v => !v.prop || typeof v.prop !== 'string')) {

        throw new Error('The `prop` property must be a string');
    }

    if (data.some(v => Object.keys(v).includes('type') && typeof v.type !== 'function')) {

        throw new Error('The `type` property must be a function');
    }

    if (data.some(v => Object.keys(v).includes('biz') && typeof v.biz !== 'function')) {

        throw new Error('The `biz` property must be a function');
    }
};

const arrayValidator = mixArray => {

    const extraPropsCount = !!mixArray.requestProp | 0;

    // NOTE:: Não copia properties de "mix array/object" (.requestProp)
    const array = mixArray.slice();
    const alloweds = ['prop', 'type', 'biz'];
    const keys = Object.keys(mixArray);

    if (keys.length !== array.length + extraPropsCount) {

        throw new Error('Some properties are not allowed');
    }

    const isDirty = array.some(item => {
        const itemKeys = Object.keys(item);
        return itemKeys.some(v => !alloweds.includes(v));
    });

    if (isDirty) {

        throw new Error('Some properties are not allowed');
    }
};

/**
 * 
 * @param { (object|array) } value Pode ser "mixArray" - array com props
 */
const thisValidator = value => {

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

        throw new Error('Some properties are not allowed');
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

        thisValidator(this);

        const that = {
            reqProp: makeRequestProp.call(this, req),
            data: Array.isArray(this) ? this.slice() : [this]
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

        printError(err);
        return res.json({ success: false });
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