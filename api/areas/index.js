const router = require('express').Router();

router.param('areaId', paramLookup('areas'));

router.route('/')
	.get()
	.post();

router.route('/:areaId')
	.get()
	.post()
	.patch()
	.put()
	.delete();

router.use('/rooms', require('./rooms'));
router.use('/items', require('./items'));
router.use('/npcs', require('./npcs'));
router.use('/instances', require('./instances'));
module.exports = router;