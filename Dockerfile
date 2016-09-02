FROM node
MAINTAINER Clement Michaud

WORKDIR /src

ADD package.json /src/package.json
ADD app.js /src/app.js
ADD take_screenshot.js /src/take_screenshot.js

RUN npm install
CMD ["node", "app.js"]

