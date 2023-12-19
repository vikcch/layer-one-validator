'use string';

const biz = require('../../helpers/biz');

const assert = require('assert');

describe('helpers biz', function () {

    describe('# isUsername', function () {

        it('1. should return if is a username', function () {

            const actual = biz.isUsername('vikcch');
            const expected = true;

            assert.strictEqual(actual, expected);
        });

        it('2. should return if is a username', function () {

            const actual = biz.isUsername('vikcch1');
            const expected = false;

            assert.strictEqual(actual, expected);
        });

        it('3. should return if is a username', function () {

            const actual = biz.isUsername('vik');
            const expected = false;

            assert.strictEqual(actual, expected);
        });

        it('4. should return if is a username', function () {

            const actual = biz.isUsername(null);
            const expected = false;

            assert.strictEqual(actual, expected);
        });

        it('5. should return if is a username', function () {

            const actual = biz.isUsername([]);
            const expected = false;

            assert.strictEqual(actual, expected);
        });

        it('6. should return if is a username', function () {

            const actual = biz.isUsername('Vikcch');
            const expected = true;

            assert.strictEqual(actual, expected);
        });
    });

    describe('# isCoordsArray', () => {

        it('1. should be true', () => {

            assert.strictEqual(biz.isCoordsArray([{ x: 23, y: 52 }]), true);

        });

        it('1. should be false', () => {

            assert.strictEqual(biz.isCoordsArray([]), false);

        });

    });
});