const router = require('express').Router();
const codes = require('http-status-codes');
const logger = require('../utils/logging');
const db = require('../database');

const modelLookup = (name) =>
{
	if (db.models[name]) return db.models[name];
	return null;
};

const getDocumentById = (model, documentId) =>
{
	return model.findById(documentId)
		.then((instance) =>
		{
			if (instance)
			{
				return instance.document;
			}

			return null;
		});
};

exports.paramLookup = (modelName) =>
{
	const model = modelLookup(modelName);
	return (req, res, next, value, name) =>
	{
		if (!model)
		{
			return res.status(codes.NOT_FOUND).json({error: {reason: `data model ${modelName} not found`}});
		}

		getDocumentById(model, value)
			.then((document) =>
			{
				if (document)
				{
					if (!req.orm) req.orm = {};
					if (!req.orm[modelName]) req.orm[modelName] = {};
					req.orm[modelName][value] = document;
					return next();
				}

				return res.status(codes.NOT_FOUND).json({error: {reason: `${name}:${value} not found`}});
			})
			.catch((reason) =>
			{
				logger.error('paramLookup exception', {error: {reason: reason}});
				return res.status(codes.INTERNAL_SERVER_ERROR).json({error: {reason: 'internal server error'}});
			});
	};
};
