import express from 'express';
import { checkCardMatch } from '../controllers/card/checkMatch';
import { revealCard } from '../controllers/card/reveal';

const router = express.Router();

router.post('/reveal', revealCard);
router.post('/checkMatch', checkCardMatch);

export default router;