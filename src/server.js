const http = require('http');

require('dotenv').config()

const app = require('./app');
const {loadPlanetData} = require('./models/planets.models')
const {loadLaunchData} = require('./models/launches.models')
const {mongoConnect} = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
  await mongoConnect()
  await loadPlanetData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  })
}

startServer();
