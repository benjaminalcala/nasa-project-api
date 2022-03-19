const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');


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


const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
  const response = await axios.post(SPACEX_API_URL, {
    "query":{},
    "options": {
        "pagination": false,
        "populate": [
            {
            "path": "rocket",
            "select": {
            "name": 1
            }
        },
        {
            "path": "payloads",
            "select": {
            "customers": 1
            }
        }
        ]
    }
})

if(response.status !== 200){
  console.log('Problem downloading launch data');
  throw new Error('Launch data download failed')
}

const launchDocs = response.data.docs;

for(const launchDoc of launchDocs){
  
  const customers = launchDoc.payloads.flatMap(payload => {
    return payload.customers;
  })
  
  const launch = {
    flightNumber: launchDoc.flight_number,
    mission: launchDoc.name,
    rocket: launchDoc.rocket.name,
    launchDate: launchDoc.date_local,
    customers,
    upcoming: launchDoc.upcoming,
    success: launchDoc.success
    }

    await saveLaunch(launch)

    console.log(`${launch.flightNumber} ${launch.mission}`)
}

}

async function loadLaunchData(){
  const firstLaunch = await findLaunch({
    rocket: 'Falcon1',
    mission: 'FalconSat',
    flightNumber: 1
  })

  if(firstLaunch){
    console.log('Launch data already loaded')
  }else{
    await populateLaunches();
  }

}



async function getAllLaunches(limit, skip){

  return await launchesDatabase.find({}, 
    {'_id': 0, '__v': 0}
  )
  .sort({flightNumber: 1})
  .limit(limit)
  .skip(skip)
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
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if(!planet){
    throw new Error('Planet was not found')
  }

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

async function findLaunch(filter){
  return await launchesDatabase.findOne(filter)
}

async function launchExists(launchId){
  return await findLaunch({
    flightNumber: launchId
  })
  
}

async function saveLaunch(launch){
  
  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  } )
}


module.exports = {
  loadLaunchData,
  getAllLaunches,
  setNewLaunch,
  abortLaunch,
  launchExists
}