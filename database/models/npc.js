const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) =>
{
	const Npc = sequelize.define('npc',
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

	Npc.associate = (db) =>
	{
		// associations
	};

	return Npc;
};
