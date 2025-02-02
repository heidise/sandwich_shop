# Base image from the official Node.js image on Docker Hub
FROM node:21-alpine3.18 AS build

# Create app directory
WORKDIR /app/frontend

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy code needed to run the app to the container
COPY . .

# Create production build of app
RUN npm run build

# Use nginx as production server
FROM nginx:1.21-alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Expose the port the app runs on 5173 for vite and 80 for nginx
# EXPOSE 5173 
# For development
EXPOSE 80

# Serve the app
# CMD ["npm", "run", "preview"] 
# For development
CMD ["nginx", "-g", "daemon off;"]