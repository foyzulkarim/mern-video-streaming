FROM node:18-alpine
WORKDIR /app
ADD package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
EXPOSE 4001
CMD [ "npm", "start"]
