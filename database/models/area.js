const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) =>
{
	const Area = sequelize.define('area',
	{
		id:
		{
			type: DataTypes.STRING,
			validate: {isUUID: 4},
			defaultValue: () => {return uuid();},
			primaryKey: true
		},
		document:
		{
			type: DataTypes.JSON,
			allowNull: false
		}
	},
	{
		timeStamps: true
	});

	Area.associate = (db) =>
	{
		// associations
		// rooms
		Area.hasMany(db.models.rooms, {as: 'Rooms', foreignKey: 'areaId'});
		// exits - these are associated with both an area and a room
		Area.hasMany(db.models.exits, {as: 'Exits', foreignKey: 'areaId'});
		// items - templates for instances
		Area.hasMany(db.models.items, {as: 'Items', foreignKey: 'areaId'});
		// NPCs - (non-player characters) templates for instances
		Area.hasMany(db.models.npcs, {as: 'Npcs', foreignKey: 'areaId'});
		// instances - information used to manage instances of items and npcs within the game
		Area.hasMany(db.models.instances, {as: 'Instances', foreignKey: 'areaId'});
	};

	return Area;
};
