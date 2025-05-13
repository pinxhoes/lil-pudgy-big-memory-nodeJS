"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
async function main() {
    const cardsDir = path_1.default.join(__dirname, '../public/cards'); // 🔧 fixed
    const files = await promises_1.default.readdir(cardsDir);
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
