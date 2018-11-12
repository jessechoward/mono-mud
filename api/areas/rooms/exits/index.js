const router = require('express').Router();
const paramLookup = require('../../../params').paramLookup;

router.param('exitId', paramLookup('exits'));

router.route('/')
	.get()
	.post();

router.route('/:exitId')
	.get()
	.post()
	.patch()
	.put()
	.delete();

module.exports = router;