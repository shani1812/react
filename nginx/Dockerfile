# Step 1: Build the frontend using Node.js (multi-stage build)
FROM node:16 AS build

WORKDIR /app

# Copy package.json and package-lock.json for the frontend
COPY ./front/package.json ./front/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY ./front ./ 

# Build the frontend (this generates the dist folder)
RUN npm run build

# Step 2: Copy build artifacts into the Nginx image
FROM nginx:latest

WORKDIR /usr/share/nginx/html

# Remove any default Nginx HTML files
RUN rm -rf ./*

# Copy built frontend files from the build stage to Nginx
COPY --from=build /app/dist ./

# Copy custom Nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf 

# Expose ports
EXPOSE 80 443
