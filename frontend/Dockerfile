FROM node:20-alpine

WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build

EXPOSE 300


CMD ["npm", "run", "start"]