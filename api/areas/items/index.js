const router = require('express').Router();
const paramLookup = require('../../params').paramLookup;

router.param('itemId', paramLookup('items'));

router.route('/')
	.get()
	.post();

router.route('/:itemId')
	.get()
	.post()
	.patch()
	.put()
	.delete();

module.exports = router;