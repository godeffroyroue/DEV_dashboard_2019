FROM node:10.16.3

RUN mkdir app
COPY package.json /app
COPY public/ /app/public/
COPY src/ /app/src/
WORKDIR /app
RUN npm install

EXPOSE 3000
CMD npm start
