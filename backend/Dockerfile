FROM node:18

WORKDIR /src/app

RUN npm i -g @nestjs/cli --silent

COPY . .

RUN npm i --silent

CMD ["npm", "run", "start:dev"]
