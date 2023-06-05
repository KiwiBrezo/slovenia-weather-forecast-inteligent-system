# Use an official Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the app's source code
COPY . .

# Remove local dev env
RUN rm .env

# Rename env for docker
RUN mv .env.docker .env

# Build the app
RUN npm run build

# Expose the container's port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
