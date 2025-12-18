# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем node_modules из deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Устанавливаем все зависимости (включая dev) для сборки
RUN npm install

# Собираем Next.js приложение
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создаем пользователя nextjs
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

