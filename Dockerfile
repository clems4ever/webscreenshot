FROM node
MAINTAINER Clement Michaud

WORKDIR /src

ADD package.json /src/package.json
ADD bin/ /src/bin
ADD lib/ /src/lib

RUN npm install
CMD ["node", "app.js"]

