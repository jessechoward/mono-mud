// eslint-disable-next-line new-cap
const router = require('express').Router();
const paramLookup = require('../params').paramLookup;

router.param('identityId', paramLookup('identity'));

router.route('/')
	.get()
	.post();

router.route('/:identityId')
	.get()
	.post()
	.patch()
	.put()
	.delete();

router.use('/:identityId/players', require('./players'));

module.exports = router;