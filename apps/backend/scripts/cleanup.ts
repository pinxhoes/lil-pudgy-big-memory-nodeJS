import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function main() {
    let totalDeleted = 0;

    // 🧹 Step 0: Delete all Cards first (clean slate)
    const cardResult = await prisma.card.deleteMany({});
    console.log(`✅ Deleted ${cardResult.count} cards.`);

    // 1. 🧼 Delete orphan solo games (no userId)
    const soloResult = await prisma.game.deleteMany({
        where: {
            mode: 'solo',
            userId: null,
        },
    });
    console.log(`✅ Deleted ${soloResult.count} solo games without user.`);
    totalDeleted += soloResult.count;

    // 2. 🕰️ Delete time trial games older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldTTResult = await prisma.game.deleteMany({
        where: {
            mode: 'timetrial',
            createdAt: { lt: thirtyDaysAgo },
        },
    });
    console.log(`✅ Deleted ${oldTTResult.count} old Time Trial games.`);
    totalDeleted += oldTTResult.count;

    // 3. 🚫 Delete any game with durationMs = 0 (incomplete)
    const unfinishedTimetrials = await prisma.game.deleteMany({
        where: {
            mode: 'timetrial',
            durationMs: 0,
        },
    });
    console.log(`🧹 Deleted ${unfinishedTimetrials.count} unfinished timetrial games.`);
    totalDeleted += unfinishedTimetrials.count;

    console.log(`✨ Total cleaned up: ${totalDeleted} games.`);
}

main().catch((e) => {
    console.error('❌ Cleanup failed:', e);
    process.exit(1);
});