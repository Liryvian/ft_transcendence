#!/bin/bash

npm create vue@3 -y -- --project-name "frontend" --typescript --vue-router --vitest --playwright --eslint-with-prettier
cd frontend
npm install
