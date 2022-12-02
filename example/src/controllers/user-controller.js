'use strict';

const layerOneValidator = require('layer-one-validator');
const fns = require('../helpers/fns');
const biz = require('../helpers/biz');

module.exports = {

    body: {

        headsup(req, res, next) {

            console.log('body', req.body);
            next();
        },

        validations: {

            layerOne: layerOneValidator.body.bind([
                { prop: 'id', type: fns.isNumber, biz: fns.isPositiveInteger },
                { prop: 'username', type: fns.isString, biz: biz.isUsername },
            ])
        },

        execute(req, res, next) {

            // My logic
            next();
        },

        render(req, res) {
            const { id, username } = req.body;
            res.json({ success: true, id, username });
        }
    },

    params: {

        headsup(req, res, next) {

            console.log('params', req.params);
            next();
        },

        validations: {

            layerOne: layerOneValidator.params.bind([
                { prop: 'id', biz: fns.canbePositiveInteger },
                { prop: 'username', type: fns.isString, biz: biz.isUsername },
            ])
        },

        execute(req, res, next) {

            // My logic
            next();
        },

        render(req, res) {
            const { id, username } = req.params;
            res.json({ success: true, id, username });
        }
    },

    query: {

        headsup(req, res, next) {

            console.log('query', req.query);
            next();
        },

        validations: {

            layerOne: layerOneValidator.query.bind([
                { prop: 'id', biz: fns.canbePositiveInteger },
                { prop: 'username', type: fns.isString, biz: biz.isUsername },
            ])
        },

        execute(req, res, next) {

            // My logic
            next();
        },

        render(req, res) {
            const { id, username } = req.query;
            res.json({ success: true, id, username });
        }
    }

};