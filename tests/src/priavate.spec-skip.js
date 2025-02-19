'use strict';

const { testables } = require('../../src/index.js');
const assert = require('assert');


describe('testables', () => {

    describe('# hasAllRequiredProps', () => {

        it('1. Should return true when all required properties are present', () => {
            const requestProps = { name: 'vikcch', age: '43' };
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('2. Should return false when a required property is missing', () => {
            const requestProps = { name: 'vikcch' };
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('3. Should return true when required and optional properties are present', () => {
            const requestProps = { name: 'vikcch', age: '43', city: 'NY' };
            const expectedProps = [
                { prop: 'name' },
                { prop: 'age' },
                { prop: 'city', optional: true }
            ];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('4. Should return false when request object contains extra properties', () => {
            const requestProps = { name: 'vikcch', age: '43', city: 'NY' };
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = false; 

            assert.deepStrictEqual(actual, expected);
        });

        it('5. Should return false when request object is empty but required properties exist', () => {
            const requestProps = {};
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('6. Should return true when only optional properties are present', () => {
            const requestProps = { city: 'NY' };
            const expectedProps = [{ prop: 'city', optional: true }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('7. Should return false when missing required properties but contains optional ones', () => {
            const requestProps = { city: 'NY' };
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }, { prop: 'city', optional: true }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('8. Should return true when all required properties are present, even if an optional property is missing', () => {
            const requestProps = { name: 'vikcch', age: '43' };
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }, { prop: 'city', optional: true }];
        
            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = true;
        
            assert.deepStrictEqual(actual, expected);
        });
        
        it('9. Should return false when an optional property is present but all required ones are missing', () => {
            const requestProps = { city: 'NY' };
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }, { prop: 'city', optional: true }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('10. Should return true when no required properties exist', () => {
            const requestProps = { city: 'NY' };
            const expectedProps = [{ prop: 'city', optional: true }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = true;

            assert.deepStrictEqual(actual, expected);
        });

        it('11. Should return false when only one of multiple required properties is present', () => {
            const requestProps = { name: 'vikcch' };
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }, { prop: 'city', optional: true }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = false;

            assert.deepStrictEqual(actual, expected);
        });

        it('12. Should return false when request object has more properties than required ones', () => {
            const requestProps = { name: 'vikcch', age: '43', city: 'NY', country: 'USA' };
            const expectedProps = [{ prop: 'name' }, { prop: 'age' }];

            const actual = testables.hasAllRequiredProps(requestProps, expectedProps);
            const expected = false; 

            assert.deepStrictEqual(actual, expected);
        });

    });
})