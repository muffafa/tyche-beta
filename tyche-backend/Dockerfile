# tyche-backend/Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install dependencies for building and Redis
RUN apk add --no-cache python3 make g++ redis supervisor

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Remove build dependencies to reduce image size
RUN apk del python3 make g++

# Copy the rest of the application code
COPY . .

# Copy supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the ports the app and Redis run on
EXPOSE 5005 6379

# Define the command to run supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
