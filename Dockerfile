FROM node:21-alpine AS base
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node . .
RUN npm install
RUN node ace build --ignore-ts-errors
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
RUN cd build && npm ci --omit=dev
RUN ls -al
RUN cd build && ls -al
RUN cd build/bin && ls -al
EXPOSE $PORT
CMD [ "node", "build/bin/server.js" ]