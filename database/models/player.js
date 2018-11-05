const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) =>
{
	const Player = sequelize.define('player',
	{
		id:
		{
			type: DataTypes.STRING,
			validate: {isUUID: 4},
			defaultValue: () => {return uuid();},
			primaryKey: true
		},
		identityId:
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

	Player.associate = (db) =>
	{
		// associations
	};

	return Player;
};
