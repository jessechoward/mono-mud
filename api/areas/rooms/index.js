const router = require('express').Router();
const paramLookup = require('../../params').paramLookup;

router.param('roomId', paramLookup('rooms'));

router.route('/')
	.get()
	.post();

router.route('/:roomId')
	.get()
	.post()
	.patch()
	.put()
	.delete();

router.use('/exits', require('./exits'));

module.exports = router;