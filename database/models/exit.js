const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) =>
{
	const Exit = sequelize.define('exit',
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

	Exit.associate = (db) =>
	{
		// associations
	};

	return Exit;
};
