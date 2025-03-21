FROM node:16

WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app’s code
COPY . .

# Expose port (if needed)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]