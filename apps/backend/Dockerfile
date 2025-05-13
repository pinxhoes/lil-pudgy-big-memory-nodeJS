FROM node:18-slim
WORKDIR /app

COPY apps/backend/package*.json ./
RUN npm install

COPY apps/backend .


RUN npx prisma generate

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]