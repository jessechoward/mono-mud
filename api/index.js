const router = require('express').Router();
const paramLookup = require('./params').paramLookup;

// parameters we want to resolve
router.param('identityId', paramLookup('identity'));
router.param('playerId', paramLookup('players'));
router.param('areaId', paramLookup('areas'));
router.param('roomId', paramLookup('rooms'));
router.param('exitId', paramLookup('exits'));
router.param('npcId', paramLookup('npcs'));
router.param('itemId', paramLookup('items'));
router.param('instanceId', paramLookup('instances'));

// identity is a top level for players
router.use('/identity', require('./identity'));
// areas are top level for rooms, items, npcs and instances
router.use('/areas', require('./areas'));

module.exports = router;