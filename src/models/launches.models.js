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

launches.set(launch.flightNumber, launch)

function getAllLaunches(){
  return Array.from(launches.values());
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


module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExists
}