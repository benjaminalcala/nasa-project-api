const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 30, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true
}

const DEFAULT_FLIGHT_NUMBER = 100;

saveLaunch(launch)

async function getAllLaunches(){
  return await launchesDatabase.find({}, 
    {'_id': 0, '__v': 0}
  )
}


async function getLatestFlightNumber(){
  const latestLaunch = await launchesDatabase
  .findOne()
  .sort('-flightNumber')

  if(!latestLaunch){
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;

}

async function setNewLaunch(launch){
  const latestFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  })

  await saveLaunch(newLaunch);
}

async function abortLaunch(launchId){
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId
  }, {
    success: false,
    upcoming: false
  })
  
  return aborted.modifiedCount === 1;
}

async function launchExists(launchId){
  return await launchesDatabase.findOne({
    flightNumber: launchId
  })
  
}

async function saveLaunch(launch){
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if(!planet){
    throw new Error('Planet was not found')
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  } )
}


module.exports = {
  getAllLaunches,
  setNewLaunch,
  abortLaunch,
  launchExists
}