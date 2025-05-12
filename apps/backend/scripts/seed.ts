import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const cardsDir = path.join(__dirname, '../public/cards'); // 🔧 fixed
    const files = await fs.readdir(cardsDir);
    const svgFiles = files.filter((f) => f.endsWith('.svg'));

    const cards = svgFiles.map((file, index) => ({
        id: index + 1,
        name: `Card ${index + 1}`,
        imageUrl: `/cards/${file}`,
    }));

    await prisma.cardTemplate.createMany({
        data: cards,
        skipDuplicates: true,
    });

    console.log(`🌱 Seeded ${cards.length} Card Templates`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());