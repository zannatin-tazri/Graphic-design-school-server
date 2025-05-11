# Use Node.js v18 image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy only package.json and package-lock.json first (layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project files
COPY . .

# App will listen on this port
EXPOSE 5000

# Command to start the server
CMD ["node", "index.js"]
