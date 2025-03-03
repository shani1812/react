
FROM node:16 AS build

WORKDIR /app


COPY package.json package-lock.json ./


RUN npm ci


COPY . .


RUN npm run build


RUN ls -la /app


FROM node:16

WORKDIR /app


COPY --from=build /app/dist /app/build


RUN npm install serve


EXPOSE 5173


CMD ["npx", "serve", "-s", "build", "-l", "5173"]
