FROM node:21-alpine AS base
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --ignore-ts-errors

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
COPY --chown=node:node --from=build /home/node/app/build .
RUN npm ci --omit=dev
EXPOSE $PORT
CMD [ "node", "build/bin/server.js" ]