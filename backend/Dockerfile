FROM node:18

WORKDIR /src/app

RUN npm i -g @nestjs/cli --silent

COPY . .

RUN npm ci

CMD ["npm", "run", "start:debug"]
