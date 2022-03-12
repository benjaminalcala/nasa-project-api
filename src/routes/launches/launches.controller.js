const {addNewLaunch, getAllLaunches} = require('../../models/launches.models');

function httpGetAllLaunches(req,res){
  res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res){
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

  addNewLaunch(launch);
  return res.status(201).json(launch)

}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch
}