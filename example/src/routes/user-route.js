'use strict';

const userController = require('../controllers/user-controller');
const router = require('express').Router();

router.post('/',
    userController.body.headsup,
    userController.body.validations.layerOne,
    userController.body.execute,
    userController.body.render
);

router.post('/:id/:username',
    userController.params.headsup,
    userController.params.validations.layerOne,
    userController.params.execute,
    userController.params.render
);

router.get('/query',
    userController.query.headsup,
    userController.query.validations.layerOne,
    userController.query.execute,
    userController.query.render
);

module.exports = router;