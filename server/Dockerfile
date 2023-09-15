FROM node:18-alpine
WORKDIR /app
ADD package*.json ./
RUN npm install
RUN apk update
RUN apk add
RUN apk add ffmpeg
COPY . .
EXPOSE 4000
EXPOSE 4001
CMD [ "npm", "run", "server"]
