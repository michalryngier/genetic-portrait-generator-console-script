FROM node:20

WORKDIR /app

COPY package*.json /app

RUN chown -R node:node /app

USER node

RUN npm install

COPY --chown=node:node . /app

RUN npm run build