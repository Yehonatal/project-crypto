# Use the official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R backend:nodejs /app
USER backend

# Expose the port the app runs on
EXPOSE 4000

# Define environment variable
ENV NODE_ENV=production

# Command to run the application
CMD ["pnpm", "start"]
