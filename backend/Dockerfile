<<<<<<< HEAD
# Base image, small node image
FROM node:slim

# Specify cwd inside the container
WORKDIR /srv/app

RUN npm i -g @nestjs/cli --silent

# copy src dest
COPY . .

RUN npm install --silent

CMD npm run start:dev
=======
FROM node:18

WORKDIR /src/app

RUN npm i -g @nestjs/cli --silent

COPY . .

RUN npm i --silent

CMD ["npm", "run", "start:debug"]
>>>>>>> 12a6c0c1362c965c14a4d050c3f9689f370b34f4
