const http = require('http');

const mongoose = require('mongoose');
require('dotenv').config()

const app = require('./app');
const {loadPlanetData} = require('./models/planets.models')

const MONGO_URI = `mongodb+srv://nasa-api:${process.env.MONGO_PASSWORD}@cluster0.xehww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose.connection.once('open', ()=> {
  console.log('Mongo connection ready...')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function startServer(){
  await mongoose.connect(MONGO_URI)
  await loadPlanetData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  })

}

startServer();
