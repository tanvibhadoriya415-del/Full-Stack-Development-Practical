# Experiment 3: Student Academic Portfolio

## Aim
To develop a student academic portfolio using React, Node.js, Express, and MongoDB.

## Description
This project is a web-based student academic portfolio. It provides a dashboard and a Projects section to add, view, edit, and delete academic projects.

## Features
- Student portfolio dashboard
- Projects management
- Add, edit, and delete project entries
- React-based frontend
- Express REST API backend

## Technologies Used
- React
- Vite
- Node.js
- Express.js
- MongoDB / Mongoose (planned integration)

## Project Structure
- `client/` — frontend application
- `server/` — backend API

## How to Run
1. Open a terminal in the `client` folder and run `npm install`.
2. Start the frontend with `npm run dev`.
3. Open another terminal in the `server` folder and run `npm install`.
4. Start the backend with `node index.js`.
5. Open the local URL shown by Vite in your browser.

## Note
The current backend uses in-memory data for project entries. MongoDB integration is not yet connected, so project data may reset when the server restarts.
