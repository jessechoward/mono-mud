const router = require('express').Router();
const paramLookup = require('../../params').paramLookup;

router.param('playerId', paramLookup('players'));

router.route('/')
	.get()
	.post();

router.route('/:playerId')
	.get()
	.post()
	.patch()
	.put()
	.delete();

module.exports = router;