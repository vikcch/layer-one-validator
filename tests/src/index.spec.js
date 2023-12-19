'use strict';

const layerOneValidator = require('../../src/index.js');
const { failMessages } = require('../../src/index.js').body.call('messages');
const fns = require('../../helpers/fns');
const biz = require('../../helpers/biz');

const assert = require('assert');

const res = actual => {
    return {
        json: props => actual.value = props,
        status(code) {
            actual.status = code;
            return this;
        }
    };
};

// NOTE:: `{ success: true }` apenas em testes
const next = actual => () => { actual.value = { success: true } };

const source = failMessages.source;
const message = failMessages.message_500;

describe('layerOneValidator', function () {

    it('1. it should validate fields, types and business', function () {

        const values = [
            { prop: 'username', biz: (v => v === 'vik') }
        ];

        const actual = {};

        const req = { body: { username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('2. it should validate fields, types and business', function () {

        const values = [
            { prop: 'ids', biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: { ids: [12, 56] } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('3. it should validate fields, types and business', function () {

        const biz = ({ name, age }) => name === 'vik' && age > 18;

        const values = [{ prop: 'data', biz }];

        const actual = {};

        const req = { body: { data: { name: 'vik', age: 45 } } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('4. it should validate fields, types and business', function () {

        const values = [{ prop: 'id' }];

        const actual = {};

        const req = { body: { id: '324' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('5. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: { id: 3 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('6. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger },
            { prop: 'username', type: fns.isString, biz: v => /^[a-z]{3}$/.test(v) }
        ];

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('7. it should validate fields, types and business', function () {

        const values = { prop: 'id', type: fns.isNumber };

        const actual = {};

        const req = { body: { id: 3 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('8. it should validate fields, types and business', function () {

        const values = { prop: 'id', type: fns.isNumber };

        const actual = {};

        const req = { body: { id: 3 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('9. it should validate fields, types and business', function () {

        const values = { prop: 'id', biz: fns.canBePositiveInteger };

        const actual = {};

        const req = { body: { id: '3' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('10. it should validate fields, types and business', function () {

        const values = [
            { type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('11. it should validate fields, types and business', function () {

        const values = [
            { prop: '', type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('12. it should validate fields, types and business', function () {

        const values = undefined;

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('13. it should validate fields, types and business', function () {

        const values = { prop: 'id' };

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        // NOTE:: Não espera todos of fields
        const expected = { success: false, message: failMessages.base.fields };

        const { success, message } = actual.value;

        assert.deepStrictEqual({ success, message }, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('14. it should validate fields, types and business', function () {

        const values = { prop: 'id', type: v => Number.isInteger(v), biz: v => v > 0 };

        const actual = {};

        const req = { body: { id: 3 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('15. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: { id: 3 } };

        layerOneValidator.params.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('16. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: { id: 3 } };

        layerOneValidator.query.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('17. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: { username: 3 } };

        layerOneValidator.query.call(values, req, res(actual), next(actual));

        // NOTE:: Não espera todos of fields
        const expected = { success: false, message: failMessages.base.fields };

        const { success, message } = actual.value;

        assert.deepStrictEqual({ success, message }, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('18. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: {} };

        layerOneValidator.query.call(values, req, res(actual), next(actual));

        // NOTE:: Não espera todos of fields
        const expected = { success: false, message: failMessages.base.fields };

        const { success, message } = actual.value;

        assert.deepStrictEqual({ success, message }, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('19. it should validate fields, types and business', function () {

        const values = {};

        const actual = {};

        const req = { body: {} };

        layerOneValidator.query.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('20. it should validate fields, types and business', function () {

        const values = { prop: 'id', somethingwrong: null };

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('21. it should validate fields, types and business', function () {

        const values = [
            {
                prop: 'id', type: fns.isNumber,
                biz: fns.isPositiveInteger, somethingwrong: null
            }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('22. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, somethingwrong: null }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('23. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, somethingwrong: null }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('24. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, requestProp: 'body' }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('25. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: v => typeof v === 'number', requestProp: 'body' }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('26. it should validate fields, types and business', function () {

        const values = [
            { prop: 'usernames', type: v => Array.isArray(v), biz: biz.isUsername }
        ];

        const actual = {};

        const req = { body: { usernames: ['rita', 'joana'] } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('27. it should validate fields, types and business', function () {

        const values = [
            { prop: 'usernames', type: fns.isString, biz: biz.isUsername }
        ];

        const actual = {};

        const req = { body: { usernames: ['rita', 'joana'] } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('28. it should validate fields, types and business', function () {

        const values = [
            { prop: 'values', type: fns.isObject, biz: biz.isCoords }
        ];

        const actual = {};

        const req = {
            body: {
                values: [
                    { x: 45, y: 25 },
                    { x: 23, y: '34' },
                    { x: 23, y: '34' },
                    { x: 23, y: '34' },
                ]
            }
        };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = {
            success: false,
            message: `${failMessages.base.biz}`,
            fail: 'values',
            source
        };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 422);
    });

    it('29. it should validate fields, types and business', function () {

        const values = [
            { prop: 'values', type: fns.isObject, biz: undefined }
        ];

        const actual = {};

        const req = {
            body: {
                values: [
                    { x: 45, y: 25 },
                    { x: 23, y: '34' },
                ]
            }
        };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('30. it should validate fields, types and business', function () {

        const values = [
            { prop: 'values', type: undefined, biz: biz.isCoords }
        ];

        const actual = {};

        const req = {
            body: {
                values: [
                    { x: 45, y: 25 },
                    { x: 23, y: '34' },
                ]
            }
        };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('31. it should validate fields, types and business', function () {

        const values = [
            { prop: 'values', type: fns.isObjectArray, biz: biz.isCoordsArray }
        ];

        const actual = {};

        const req = {
            body: {
                values: [
                    { x: 45, y: 25 },
                    { x: 23, y: 34 },
                ]
            }
        };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('32. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', biz: biz.isId }
        ];

        const actual = {};

        const req = { body: { id: '324' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('33. it should validate fields, types and business', function () {

        const values = [
            { prop: 'coords', type: fns.isObject, biz: biz.isCoords }
        ];

        const actual = {};

        const req = { body: { coords: { x: 1, y: 3 } } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: true };

        assert.deepStrictEqual(actual.value, expected);
    });


    it('34. two properties must be inside an array', function () {


        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(

            { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger },
            { prop: 'username', biz: (v => v === 'vik') }

            , res(actual), next(actual));

        // NOTE:: ↑ Sem `req`, para `res` ter "json()" e não par pau

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('35. should name `id` as a missing `biz` function', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, biz: fns.isNonExistence },
            { prop: 'username', biz: (v => v === 'vik') }
        ];

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('36. should name `username` as a missing `type` function', function () {

        const values = [
            { prop: 'id', type: fns.isNumber },
            { prop: 'username', type: fns.isNonExistence }
        ];

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('37. should say `12` must be a string', function () {

        const values = [
            { prop: 12, type: fns.isNumber },
            { prop: 'username', biz: (v => v === 'vik') }
        ];

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('38. `username` was not to send', function () {

        const values = [
            { prop: 'id', type: fns.isNumber },
        ];

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const fail = { extra: ['username'], missing: [] };

        const expected = { success: false, message: failMessages.base.fields, fail, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('39. extra fields sended', function () {

        const values = [
            { prop: 'id', type: fns.isNumber },
        ];

        const actual = {};

        const req = { body: { car: 'on foot', id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const fail = { extra: ['car', 'username'], missing: [] };

        const expected = { success: false, message: failMessages.base.fields, fail, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('40. missing fields', function () {

        const values = [
            { prop: 'id', type: fns.isNumber },
            { prop: 'username' },
            { prop: 'age' },
        ];

        const actual = {};

        const req = { body: { id: 3 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const fail = { extra: [], missing: ['username', 'age'] };

        const expected = { success: false, message: failMessages.base.fields, fail, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('41. missing and extra fields', function () {

        const values = [
            { prop: 'id', type: fns.isNumber },
            { prop: 'username' },
            { prop: 'age' },
        ];

        const actual = {};

        const req = { body: { id: 3, car: 'on foot' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const fail = { extra: ['car'], missing: ['username', 'age'] };

        const expected = { success: false, message: failMessages.base.fields, fail, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('42. missing and extra fields - without bind array (var values)', function () {

        const values = { prop: 'color', type: fns.isNumber };

        const actual = {};

        const req = { body: { id: 3, car: 'on foot' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const fail = { extra: ['id', 'car'], missing: ['color'] };

        const expected = { success: false, message: failMessages.base.fields, fail, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('43. primeira prop não é string', function () {

        const values = [
            { prop: 'username', type: fns.isString, biz: biz.isUsername },
            { prop: 'coords', type: fns.isString, biz: biz.isCoordsArray }
        ];

        const actual = {};

        const req = {
            body: { username: 12345, coords: [{ x: 45, y: 25 }, { x: 23, y: 34 }] }
        };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = {
            success: false,
            message: failMessages.base.type,
            fail: 'username',
            source
        };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('44. primeira prop com array e fail na segunda prop', function () {

        const values = [
            { prop: 'coords', type: fns.isObject, biz: biz.isCoordsArray },
            { prop: 'username', type: fns.isString, biz: biz.isUsername }
        ];

        const actual = {};

        const req = {
            body: { username: 12345, coords: [{ x: 45, y: 25 }, { x: 23, y: 34 }] }
        };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = {
            success: false,
            message: failMessages.base.type,
            fail: 'username',
            source
        };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('45. primeira prop com array e fail nas duas props', function () {

        const values = [
            { prop: 'coords', type: fns.isString, biz: biz.isCoordsArray },
            { prop: 'username', type: fns.isString, biz: biz.isUsername }
        ];

        const actual = {};

        const req = {
            body: { coords: [{ x: 45, y: 25 }, { x: 23, y: 34 }], username: 12345 }
        };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = {
            success: false,
            message: `${failMessages.base.type}`,
            fail: 'coords',
            source
        };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 400);
    });

    it('46. it should validate fields, types and business', function () {

        const values = [
            { prop: 'username', biz: undefined }
        ];

        const actual = {};

        const req = { body: { username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message, source };

        assert.deepStrictEqual(actual.value, expected);
        assert.deepStrictEqual(actual.status, 500);
    });

    it('47. wrong type on array', function () {

        const values = [
            { prop: 'values', type: fns.isObject, biz: biz.isCoordsArray }
        ];

        const actual = {};

        const req = {
            body: {
                values: [1]
            }
        };


        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = {
            success: false,
            message: `${failMessages.base.type}`,
            fail: 'values',
            source
        };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('48. empty array', function () {

        const values = [
            { prop: 'values', type: fns.isObject, biz: biz.isCoordsArray }
        ];

        const actual = {};

        const req = {
            body: {
                values: []
            }
        };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = {
            success: false,
            message: `${failMessages.base.biz}`,
            fail: 'values',
            source
        };

        assert.deepStrictEqual(actual.value, expected);
    });

});