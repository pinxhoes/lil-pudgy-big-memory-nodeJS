import { prisma } from "@/app/lib/db";

async function main() {
    const result = await prisma.game.deleteMany({
        where: {
            OR: [
                { player1Id: 'guest' },
                { player2Id: 'guest' },
            ],
        },
    });

    console.log(`✅ Deleted ${result.count} guest games.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});