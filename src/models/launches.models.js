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

let latestFlightNumber = launch.flightNumber;

saveLaunch(launch)

async function getAllLaunches(){
  return await launchesDatabase.find({}, 
    {'_id': 0, '__v': 0}
  )
}

function addNewLaunch(launch){
  latestFlightNumber++;
  launches.set(latestFlightNumber, Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  }))
}

function abortLaunch(launchId){
  const aborted = launches.get(launchId);

  aborted.success = false;
  aborted.upcoming = false;

  return aborted;
}

function launchExists(launchId){
  return launches.has(launchId);
}

async function saveLaunch(launch){
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if(!planet){
    throw new Error('Planet was not found')
  }

  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  } )
}


module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExists
}