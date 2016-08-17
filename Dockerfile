FROM node
MAINTAINER Clement Michaud

ENV http_proxy 'http://proxy:3128'
ENV https_proxy 'http://proxy:3128'

RUN npm install -g casperjs phantomjs

WORKDIR /src

ADD package.json /src/package.json
RUN npm install

ADD dump_scripts /src/dump_scripts
ADD app.js /src/app.js


CMD ["node", "app.js"]

