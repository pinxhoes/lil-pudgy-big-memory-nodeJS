import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export async function getAllUsers(_req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error('[GET USERS ERROR]', error);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
}