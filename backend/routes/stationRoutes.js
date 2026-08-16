const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');

router.route('/')
  .get(stationController.getAllStations)
  .post(stationController.createStation);

router.route('/:id')
  .get(stationController.getStationById)
  .put(stationController.updateStation)
  .delete(stationController.deleteStation);

module.exports = router;
