const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) =>
{
	const Item = sequelize.define('item',
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

	Item.associate = (db) =>
	{
		// associations
	};

	return Item;
};
