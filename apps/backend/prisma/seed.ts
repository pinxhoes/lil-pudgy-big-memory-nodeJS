import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cards = Array.from({ length: 24 }, (_, i) => {
        const id = i + 1;
        return {
            id,
            name: `${id}`,
            imageUrl: `/cards/${id}.svg`,
        };
    });

    await prisma.cardTemplate.createMany({
        data: cards,
        skipDuplicates: true,
    });

    console.log('🌱 Seeded 24 Card Templates');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());