import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import path from 'path';
import authRoutes from './routes/auth';
import cardRoutes from './routes/card';
import gameRoutes from './routes/game';
import scoreboardRoutes from './routes/scoreboard';
import userRoutes from './routes/user';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/cards', express.static(path.join(__dirname, '../../public/cards')));

app.get('/api/health', (_req, res) => {
    res.send('✅ Backend is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});

app.use('/api/game', gameRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scoreboard', scoreboardRoutes);
