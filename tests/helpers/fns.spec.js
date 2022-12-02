'use strict';

const fns = require('../../helpers/fns.js');

const assert = require('assert');

describe('helpers fns', function () {

    describe('# isNumber', function () {

        it('1. should return if its a number', function () {

            const actual = fns.isNumber('34');
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('2. should return if its a number', function () {

            const actual = fns.isNumber(-32);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

    });

    describe('# isString', function () {

        it('1. should return if its a string', function () {

            const actual = fns.isString('');
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('2. should return if its a string', function () {

            const actual = fns.isString(null);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

    });

    describe('# isBoolean', function () {

        it('1. should return if its a boolean', function () {

            const actual = fns.isBoolean(false);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('2. should return if its a boolean', function () {

            const actual = fns.isBoolean('true');
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

    });

    describe('# isObject', function () {

        it('1. should return if its an object', function () {

            const actual = fns.isObject(false);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('2. should return if its an object', function () {

            const actual = fns.isObject({});
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('3. should return if its an object', function () {

            const actual = fns.isObject('some string');
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('4. should return if its an object', function () {

            const actual = fns.isObject([]);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

    });

    describe('# canBePositiveInteger', function () {

        it('1. should retuern if can be a positive integer', function () {

            const actual = fns.canBePositiveInteger('34');
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('2. should retuern if can be a positive integer', function () {

            const actual = fns.canBePositiveInteger('-34');
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('3. should retuern if can be a positive integer', function () {

            const actual = fns.canBePositiveInteger('-a34');
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('4. should retuern if can be a positive integer', function () {

            const actual = fns.canBePositiveInteger(54);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('5. should retuern if can be a positive integer', function () {

            const actual = fns.canBePositiveInteger(0);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('6. should retuern if can be a positive integer', function () {

            const actual = fns.canBePositiveInteger(false);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('7. should retuern if can be a positive integer', function () {

            const actual = fns.canBePositiveInteger('0x9D2');
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('8. should retuern if can be a positive integer', function () {

            const actual = fns.canBePositiveInteger(1);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

    });

});