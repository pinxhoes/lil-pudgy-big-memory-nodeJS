import express from 'express';
import { getScoreboard } from '../controllers/scoreboard/getScoreboard';
import { submitScore } from '../controllers/scoreboard/submitScore';

const router = express.Router();

router.get('/', getScoreboard);
router.post('/submit', submitScore);

export default router;