const mongoose = require('mongoose');

const MONGO_URI = `mongodb+srv://nasa-api:${process.env.MONGO_PASSWORD}@cluster0.xehww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connection.once('open', ()=> {
  console.log('Mongo connection ready...')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function mongoConnect(){
  await mongoose.connect(MONGO_URI);
}

async function mongoDisconnect(){
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}