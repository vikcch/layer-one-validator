'use strict';

const express = require('express');
const routes = require('./routes');
const path = require('path');

module.exports = () => {

    /** @type {import('express').Application} */
    const server = express();

    const create = () => {

        server.use(express.static(path.join(__dirname, '/views/public')))
        server.use(express.urlencoded({ extended: true }));
        server.use(express.json());

        routes.start(server);
    };

    const start = () => {

        const port = 8080;

        server.listen(port, () => {

            console.log(`Listen on port: http://127.0.0.1:${port}`);
        });
    };

    return {
        create, start
    }
};