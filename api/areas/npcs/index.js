const router = require('express').Router();
const paramLookup = require('../../params').paramLookup;

router.param('npcId', paramLookup('npcs'));

router.route('/')
	.get()
	.post();

router.route('/:npcId')
	.get()
	.post()
	.patch()
	.put()
	.delete();

module.exports = router;