FROM node:16.15.0-alpine3.15

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000
CMD ["npm", "run", "preview"]