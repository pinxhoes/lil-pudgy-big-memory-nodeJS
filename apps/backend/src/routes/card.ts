import express from 'express';
import { checkCardMatch } from '../controllers/card/checkMatch';
import { revealCardImage } from '../controllers/card/image';
import { revealCard } from '../controllers/card/reveal';

const router = express.Router();

router.post('/reveal', revealCard);
router.post('/checkMatch', checkCardMatch);
router.get('/image', revealCardImage);

export default router;