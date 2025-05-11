FROM ubuntu:latest
LABEL authors="chri"
FROM node:21-alpine
WORKDIR /app

COPY package.json .
RUN npm install --quiet --legacy-peer-deps
