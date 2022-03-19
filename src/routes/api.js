const express = require('express');

const planetsRouter = require('../routes/planets/planets.routes');
const launchesRouter = require('../routes/launches/launches.routes');


const api = express.Router();

api.use('/planets', planetsRouter);
api.use('/launches',launchesRouter);

module.exports = api;