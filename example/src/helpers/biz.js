'use strict';

const isUsername = value => /^[a-z]{4,8}$/.test(value);

module.exports = {
    isUsername
};