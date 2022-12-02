'use strict';

const isNumber = value => typeof value === 'number';

const isString = value => typeof value === 'string';

const isPositiveInteger = value => Number.isInteger(value) && value > 0;

const canbePositiveInteger = value => Number.isInteger(Number(value)) && value > 0;

module.exports = {
    isNumber,
    isString,
    isPositiveInteger,
    canbePositiveInteger
};