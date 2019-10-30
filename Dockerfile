FROM node:10

EXPOSE 3000

COPY . data
WORKDIR /data

RUN yarn build

CMD yarn start