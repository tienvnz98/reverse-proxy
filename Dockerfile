FROM node:16-alpine

WORKDIR /proxy/


COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV production
ENV PORT 9200

EXPOSE 9200
CMD [ "npm", "start" ]
