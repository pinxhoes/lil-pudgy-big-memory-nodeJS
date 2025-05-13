FROM node:18-slim

WORKDIR /app

# 👇 Install build tools required for bcrypt
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy backend package files and install deps
COPY package*.json ./
RUN npm install --include=dev
RUN npm rebuild bcrypt --build-from-source

# Copy full backend source (including tsconfig + src/)
COPY . .


# Build TypeScript into /dist
RUN npm run build


# Generate Prisma client
RUN npx prisma generate

EXPOSE 4000

# Migrate DB and start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]