'use strict';

const layerOneValidator = require('../../src/index.js');
const { failMessages } = require('../../src/index.js').body.call('messages');
const fns = require('../../helpers/fns');
const biz = require('../../helpers/biz');

const assert = require('assert');

const res = actual => ({ json(props) { actual.value = props; } });
const next = actual => () => { actual.value = { success: true } };

describe('helpers layerOneValidator', function () {

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

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('11. it should validate fields, types and business', function () {

        const values = [
            { prop: '', type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('12. it should validate fields, types and business', function () {

        const values = undefined;

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('13. it should validate fields, types and business', function () {

        const values = { prop: 'id' };

        const actual = {};

        const req = { body: { id: 3, username: 'vik' } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false, message: failMessages.base.fields };

        assert.deepStrictEqual(actual.value, expected);
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

        const expected = { success: false, message: failMessages.base.fields };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('18. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger }
        ];

        const actual = {};

        const req = { body: {} };

        layerOneValidator.query.call(values, req, res(actual), next(actual));

        const expected = { success: false, message: failMessages.base.fields };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('19. it should validate fields, types and business', function () {

        const values = {};

        const actual = {};

        const req = { body: {} };

        layerOneValidator.query.call(values, req, res(actual), next(actual));

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('20. it should validate fields, types and business', function () {

        const values = { prop: 'id', somethingwrong: null };

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
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

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('22. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, somethingwrong: null }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('23. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, somethingwrong: null }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('24. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: fns.isNumber, requestProp: 'body' }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('25. it should validate fields, types and business', function () {

        const values = [
            { prop: 'id', type: v => typeof v === 'number', requestProp: 'body' }
        ];

        const actual = {};

        const req = { body: { id: 43 } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
    });

    it('26. it should validate fields, types and business', function () {

        const values = [
            { prop: 'usernames', type: v => Array.isArray(v), biz: biz.isUsername }
        ];

        const actual = {};

        const req = { body: { usernames: ['rita', 'joana'] } };

        layerOneValidator.body.call(values, req, res(actual), next(actual));

        const expected = {
            success: false,
            message: `${failMessages.base.type} :: ${failMessages.append.array}`,
            fail: 'usernames'
        };

        assert.deepStrictEqual(actual.value, expected);
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
            fail: 'values'
        };

        assert.deepStrictEqual(actual.value, expected);
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

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
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

        const expected = { success: false };

        assert.deepStrictEqual(actual.value, expected);
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

        const expected = {
            success: false,
            message: `${failMessages.base.type} :: ${failMessages.append.array}`,
            fail: 'values'
        };

        assert.deepStrictEqual(actual.value, expected);
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
});