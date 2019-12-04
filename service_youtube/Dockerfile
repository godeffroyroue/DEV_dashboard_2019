FROM node:alpine
RUN mkdir app
COPY package.json /app
COPY index.js /app
WORKDIR /app
RUN npm install
EXPOSE 7676
CMD node index