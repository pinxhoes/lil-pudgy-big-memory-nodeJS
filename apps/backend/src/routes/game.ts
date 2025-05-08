import express from 'express';
import { createSoloGame } from '../controllers/game/createSolo';
import { createTimetrialGame } from '../controllers/game/createTimetrial';

const router = express.Router();
console.log('createSoloGame type:', typeof createSoloGame);

router.post('/createSolo', createSoloGame);
router.post('/createTimetrial', createTimetrialGame);

export default router;