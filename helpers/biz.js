'use strict';

const fns = require('./fns');

const isUsername = value => {

    if (!fns.isString(value)) return false;

    return /^[a-z]{4,8}$/i.test(value);
};

const isId = value => fns.canBePositiveInteger(value);

const isCoords = ({ x, y }) => {

    return fns.isPositiveInteger(x) && fns.isPositiveInteger(y);
}

const isCoordsArray = value => {

    if (!Array.isArray(value) || !value.length) return false;

    return value.every(({ x, y }) => {

        return fns.isPositiveInteger(x) && fns.isPositiveInteger(y);
    });
}

module.exports = {
    isUsername,
    isId,
    isCoords,
    isCoordsArray
};

