import express from 'express';
import { createSoloGame } from '../controllers/game/createSolo';
import { createTimetrialGame } from '../controllers/game/createTimetrial';

const router = express.Router();
console.log('createSoloGame type:', typeof createSoloGame);

router.post('/create/solo', createSoloGame);
router.post('/create/timetrial', createTimetrialGame);

export default router;