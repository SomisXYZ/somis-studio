# Build
FROM node:18-alpine

WORKDIR /usr/local/app/

RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN npm install -g ts-node typescript

COPY . .
RUN yarn install
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000