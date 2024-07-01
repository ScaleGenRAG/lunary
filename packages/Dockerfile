# Use a base image
#use non arm version of node
FROM node:latest

# Set the working directory
WORKDIR /app

# Install dependencies


# Copy the db folder
COPY ../db ./db

# Copy the backend folder
COPY ../backend ./backend

COPY ../shared ./shared

COPY ../ml ./ml

WORKDIR shared

RUN npm install


WORKDIR /app/backend

RUN npm install
RUN npm install /app/shared
RUN npm install --save-dev typescript
RUN npm install --save-dev tsx tsup
RUN npm install dotenv



# Start the application
#CMD ["npm", "run", "dev"]