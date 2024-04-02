FROM node:18.14.0 as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock* ./
RUN yarn install

COPY . .

RUN yarn run build

FROM node:18.14.0

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/build ./build

RUN yarn global add serve

EXPOSE 80 443

CMD [ "serve", "-s", "build", "-l" , "80"]
