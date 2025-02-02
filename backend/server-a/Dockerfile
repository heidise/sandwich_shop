# Base image from the official Node.js image on Docker Hub
FROM node:21-alpine3.18 AS build

# Create app directory
WORKDIR /app/backend/server-a

# Copy dependency definitions
COPY ./package*.json ./

# Install dependencies
RUN apk add --no-cache bash
RUN npm install --silent

# Copy code needed to run the app to the container
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Serve the app
CMD ["npm", "start"]