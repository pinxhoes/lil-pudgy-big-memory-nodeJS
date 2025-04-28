import { prisma } from "@/app/lib/db";

async function main() {
    // Step 1: Find or create guest user
    let guestUser = await prisma.user.findUnique({
        where: { username: 'guest' },
    });

    if (!guestUser) {
        console.log('⚠️ Guest user not found. Creating one...');
        guestUser = await prisma.user.create({
            data: {
                username: 'guest',
                password: 'guest', // or any placeholder password
            },
        });
        console.log('✅ Guest user created.');
    }

    // Step 2: Delete all games by guest user
    const result = await prisma.game.deleteMany({
        where: { userId: guestUser.id },
    });

    console.log(`✅ Deleted ${result.count} guest games.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});