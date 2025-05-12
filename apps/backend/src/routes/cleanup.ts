import express from 'express';
import { cleanupSoloGames } from '../controllers/cleanup/solo';

const router = express.Router();

router.post('/solo', cleanupSoloGames);

export default router;