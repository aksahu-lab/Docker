###########################################
# BUILD PHASE
###########################################

# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

#fix vulnerabilities
RUN npm audit fix --force

#Upgrade
RUN npm install -g npm@10.8.2

# Copy the rest of your application files
COPY . .

###########################################
# MULTI PHASE
###########################################
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app ./

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "app.js"]
