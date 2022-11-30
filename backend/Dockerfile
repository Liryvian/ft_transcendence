# Base image, small node image
FROM node:slim

# Specify cwd inside the container
WORKDIR /srv/app

RUN npm i -g @nestjs/cli --silent

# copy src dest
COPY . .

RUN npm install --silent

CMD npm run start:dev
