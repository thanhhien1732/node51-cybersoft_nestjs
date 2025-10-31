FROM node:20.17.0-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Xóa các thư viện nằm trong devDependencies
# Vì các thư viện devDependencies chỉ sử dụng khi dev
RUN npm prune --production


FROM node:20.17.0-alpine AS start

WORKDIR /app

COPY --from=build ./app/dist ./dist
COPY --from=build ./app/generated ./generated
COPY --from=build ./app/node_modules ./node_modules

CMD ["node", "dist/main"]

# 3.16GB
# 1.77GB
# 1.78GB 
# 652MB