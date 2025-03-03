# Build Stage
FROM node:16 AS build

WORKDIR /app

# Copy only package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Run the build command
RUN npm run build

# Debug step: list files in /app to check if the build folder exists
RUN ls -la /app

# Production Stage
FROM node:16

WORKDIR /app

# Copy the build output from the build stage to the final image
COPY --from=build /app/dist /app/build

# Install 'serve' locally to serve the production build
RUN npm install serve

# Expose the port for the frontend
EXPOSE 5173

# Serve the production build using serve
CMD ["npx", "serve", "-s", "build", "-l", "5173"]
