const {getAllLaunches, setNewLaunch, abortLaunch, launchExists} = require('../../models/launches.models');

async function httpGetAllLaunches(req,res){
  res.status(200).json(await getAllLaunches())
}

async function httpAddNewLaunch(req, res){
  const launch = req.body;

  if(!launch.mission || !launch.launchDate || !launch.rocket || !launch.target){
    return res.status(400).json({
      error: 'Missing launch information'
    })
  }

  launch.launchDate = new Date(launch.launchDate);

  if(isNaN(launch.launchDate)){
    return res.status(400).json({
      error: 'Valid date required for launch date'
    })
  }

  await setNewLaunch(launch);
  return res.status(201).json(launch)

}

async function httpAbortLaunch(req, res){
  const launchId = +req.params.id;

  const exists = await launchExists(launchId)

  if(!exists){
    return res.status(404).json({
      error: 'Launch does not exist'
    })
  }

  const aborted = await abortLaunch(launchId);

  if(!aborted){
    return res.status(404).json({
      error: 'Launch not aborted'
    })
  }

  return res.status(200).json({
    ok: true
  });

}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}