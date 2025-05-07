# 🧠 Lil Pudgy Big Memory

A web-based **Memory Matching Game** built with **Next.js** (frontend) and **Node.js** (backend).  
Supports multiple game modes with PostgreSQL storage via Prisma.

---

## 🎮 Game Modes

- **Solo Player**: Play against a computer with turn-based logic.
- **Multiplayer** _(coming soon)_: Challenge your friend in real-time.
- **Time Trial**: Match all cards as fast as possible — your best time is recorded on a public leaderboard.

---

## 🛠 Tech Stack

| Layer            | Tech                                                              |
| ---------------- | ----------------------------------------------------------------- |
| Frontend         | [Next.js](https://nextjs.org/)                                    |
| Backend          | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) |
| Database         | [PostgreSQL](https://www.postgresql.org/)                         |
| ORM              | [Prisma](https://www.prisma.io/)                                  |
| Frontend Hosting | [Vercel](https://vercel.com/)                                     |
| Backend Hosting  | [Hetzner](https://www.hetzner.com/)                               |

---

## 🔧 Project Structure

memory-game-next-nodeJS/
├── frontend/ # Next.js frontend
├── backend/ # Node.js + Express backend
├── prisma/ # Shared Prisma schema
├── .env # Environment variables (not committed)
├── .env.example # Sample config
├── README.md

---

## ⚙️ Environment Setup

### 1. Configure `.env`

Create a `.env` file in the **project root** (or copy from `.env.example`):
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

### 2. Install dependencies

#### Frontend

cd ..
npm install

#### Backend

cd backend
npm install

### 3. Prisma

npx prisma generate --schema=./prisma/schema.prisma
npx prisma migrate dev --schema=./prisma/schema.prisma

## 🧠 Development

#### Frontend

cd ..
npm run dev

#### Backend

cd backend
npm run dev

## 🌍 Features

Secure backend card logic: images revealed only after matching
• Dynamic board sizing
• Mobile-first UI with responsive grid
• Leaderboard (Time Trial)
• Supports real and test users

## License

MIT © 2025 Stoopid Penguin Labs
