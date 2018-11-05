const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) =>
{
	const Room = sequelize.define('room',
	{
		id:
		{
			type: DataTypes.STRING,
			validate: {isUUID: 4},
			defaultValue: () => {return uuid();},
			primaryKey: true
		},
		areaId:
		{
			type: DataTypes.STRING,
			allowNull: false
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

	Room.associate = (db) =>
	{
		// associations
		// exits - these are associated with a room scope
		Room.hasMany(db.models.exits, {as: 'Exits', foreignKey: 'roomId'});
	};

	return Room;
};
