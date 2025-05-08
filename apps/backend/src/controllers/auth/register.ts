import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export async function registerUser(req: Request, res: Response) {
    try {
        const { username: rawUsername, password } = req.body;

        if (!rawUsername || !password) {
            return res.status(400).json({ error: 'Missing username or password' });
        }

        const username = rawUsername.toLowerCase();
        const usernamePattern = /^[a-z0-9_]{3,20}$/;

        if (!usernamePattern.test(username)) {
            return res.status(400).json({ error: 'Invalid username format' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            user: {
                id: newUser.id,
                username: newUser.username,
            },
        });
    } catch (error) {
        console.error('[REGISTER ERROR]', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}