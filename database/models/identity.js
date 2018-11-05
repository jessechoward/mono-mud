const security = require('../security');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) =>
{
	const Identity = sequelize.define('identity',
	{
		id:
		{
			type: DataTypes.STRING,
			validate: {isUUID: 4},
			defaultValue: () => {return uuid();},
			primaryKey: true
		},
		email:
		{
			type: DataTypes.STRING,
			validate: {isEmail: true},
			unique: true,
			allowNull: false
		},
		password:
		{
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		forceChange:
		{
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		enabled:
		{
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		locked:
		{
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null
		}
	},
	{
		timeStamps: true,
		freezeTableName: true,
		hooks:
		{
			beforeCreate: (identity, options) =>
			{
				return security.hashPassword(identity.password)
					.then((hash) =>
					{
						identity.password = hash;
					});
			}
		}
	});

	Identity.prototype.verify = function (password)
	{
		if (!password) return false;
		return security.verifyPassword(password, this.password);
	};

	Identity.login = (email, password) =>
	{
		return Identity.findOne(
		{
			where:
			{
				email: email
			}
		})
		.then((identity) =>
		{
			if (identity)
			{
				return {
					id: identity.id,
					email: identity.email,
					enabled: identity.enabled,
					locked: identity.locked,
					forceChange: identity.forceChange,
					createdAt: identity.createdAt,
					updatedAt: identity.updatedAt,
					authenticated: (identity.enabled && !identity.locked && identity.verify(password))
				};
			}
			else
			{
				return {error: 'not found'};
			}
		});
	};

	Identity.associate = (db) =>
	{
		// set identityId on Player instances to the owning Identity
		// adds getPlayers and setPlayers to Identity instances
		Identity.hasMany(db.models.players, {as: 'Players', foreignKey: 'identityId'});
	};

	return Identity;
};