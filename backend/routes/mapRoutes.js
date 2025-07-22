import express from 'express';
import { getLocations, logVisit } from '../controllers/mapController.js';

const router = express.Router();

router.route('/locations').get(getLocations);
router.route('/log-visit').post(logVisit);

export default router;