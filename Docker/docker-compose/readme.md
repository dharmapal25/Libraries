# Express API - Complete Docker Architecture & Debugging Guide

This comprehensive guide covers the Docker architecture used in this project, details of the bugs encountered during setup, and how they were fixed for full real-time synchronization.

---

## 🏗️ 1. Understanding the Architecture & Files

Here is how the core files work together to containerize the Express API:

### A. The Dockerfile (`./backend/Dockerfile`)
The blueprint for building the standalone production-ready image of the backend application.
* **`FROM node:20-alpine`**: Uses a lightweight Linux image with Node.js pre-installed.
* **`WORKDIR /app`**: Sets up the default folder inside the container where all commands will run.
* **`COPY package*.json ./`**: Copies `package.json` and `package-lock.json` into the current working directory (`/app`).
* **`RUN npm install`**: Installs the project dependencies inside the container.
* **`COPY . .`**: Copies the rest of the source code files from the local machine into the container.
* **`CMD [ "node", "server.js" ]`**: The default command to start the app in a production environment.

### B. The Docker Compose File (`./docker-compose.yml`)
Orchestrates the environment for development, adding volumes for live syncing and overriding default settings.
* **`ports: - "8000:5000"`**: Maps port `8000` on your local laptop to port `5000` inside the container.
* **`volumes: - ./backend:/app`**: Links the local `backend` folder to the container's `/app` folder for real-time code sharing.
* **`volumes: - /app/node_modules`**: Prevents the local machine's `node_modules` from overwriting the container's specific Linux dependencies.
* **`command: npx nodemon --legacy-watch server.js`**: Overrides the Dockerfile's `CMD` to start the server with automatic reloading enabled.

---

## 🛠️ 2. Bugs Encountered & Solutions Explained

### Bug 1: Container ID vs Image ID Confusion (`docker run` Error)
* **The Error:** Running `docker run <container_id>` threw an error saying it could not pull the repository from Docker Hub.
* **Explanation:** `docker run` is strictly designed to build and spin up a **brand new** container from an image. It cannot be used to wake up an existing container that is stopped or just created.
* **The Solution:** Use `docker start` with the `-a` (attach) flag to run the existing container and see its terminal output:
  ```bash
  docker start -a 9b8402f0bd3b