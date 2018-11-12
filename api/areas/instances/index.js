const router = require('express').Router();
const paramLookup = require('../../params').paramLookup;

router.param('instanceId', paramLookup('instances'));

router.route('/')
	.get()
	.post();

router.route('/:instanceId')
	.get()
	.post()
	.patch()
	.put()
	.delete();

module.exports = router;