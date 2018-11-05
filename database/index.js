const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const log = require('../utils/logging');

const dbEnv =
{
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	dialect: process.env.DB_DIALECT,
	storage: process.env.DB_SQLITE_PATH,
	logging: process.env.DB_LOGGING || false,
	operatorsAliases: false
};

const syncEnv =
{
	force: process.env.DB_SYNC_FORCE || false,
	alter: process.env.DB_SYNC_ALTER || false,
	match: process.env.DB_SYNC_MATCH
};

const importModels = (mudDb) =>
{
	// load the db models
	fs.readdirSync(path.join(__dirname, 'models'))
		.filter((filename) => {return path.extname(filename) === '.js';})
		.forEach((filename) =>
		{
			const model = mudDb.sequelize.import(path.join(__dirname, 'models', filename));
			mudDb.models[model.tableName] = model;
			log('Imported table: ', model.tableName);
		});
};

class MudDb
{
	constructor(dbOptions={})
	{
		const options = Object.assign({}, dbEnv, dbOptions);
		this.Sequelize = Sequelize;
		this.sequelize = new Sequelize(options);
		this.models = {};
		importModels(this);
	}

	sync(syncOptions={})
	{
		const options = Object.assign({}, syncEnv, syncOptions);
		return this.sequelize.sync(options);
	}

	associate()
	{
		for (let modelName of Object.keys(this.models))
		{
			const model = this.models[modelName];
			model.associate(this);
		}
	}

	close()
	{
		return this.sequelize.close();
	}
}

module.exports = MudDb;