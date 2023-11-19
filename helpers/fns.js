'use strict';

const isNumber = value => typeof value === 'number';

const isString = value => typeof value === 'string';

const isBoolean = value => typeof value === 'boolean';

const isObject = value => typeof value === 'object';

const isObjectArray = value => value.every(v => typeof v === 'object');

const isPositiveInteger = value => Number.isInteger(value) && value > 0;

const canBePositiveInteger = value => Number.isInteger(Number(value)) && value > 0;

const isArray = value => Array.isArray(value);

module.exports = {
    isNumber,
    isString,
    isBoolean,
    isObject,
    isObjectArray,
    isPositiveInteger,
    canBePositiveInteger,
    isArray
};