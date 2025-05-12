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
const allowedOrigins = [
    'http://localhost:3000',
    'https://stoopid.world',
    'https://api.stoopid.world'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());
app.use('/cards', express.static(path.join(__dirname, '../../public/cards')));

app.get('/api/health', (_req, res) => {
    res.send('✅ Backend is running!');
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running at http://0.0.0.0:${PORT}`);
});

app.use('/api/game', gameRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scoreboard', scoreboardRoutes);
