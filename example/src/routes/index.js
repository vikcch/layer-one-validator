'use strict';

const userRoute = require('./user-route');

module.exports = {

    start(server) {

        server.use('/user', userRoute);

        server.get('*', (req, res) => res.send('fail'));
    }
};