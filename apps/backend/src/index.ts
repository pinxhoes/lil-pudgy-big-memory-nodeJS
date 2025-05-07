import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import gameRoutes from './routes/game';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.send('✅ Backend is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});

app.use('/api/game', gameRoutes);
