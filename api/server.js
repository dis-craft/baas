// api/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

// Define the path for our "database" file.
// Note: On Vercel, file writes are temporary.
const dataFilePath = path.join(__dirname, '..', 'data.json');

// Helper function to read data.
function readData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, '[]', 'utf8');
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return [];
  }
}

// Helper function to write data.
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing data:', err);
  }
}

// API endpoint to fetch data.
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// API endpoint to add new student data.
app.post('/api/data', (req, res) => {
  const { name, usn, section } = req.body;
  if (!name || !usn || !section) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const data = readData();
  data.push({ name, usn, section });
  writeData(data);
  res.json({ message: 'Data added successfully', data });
});

// Export the app wrapped as a serverless function.
module.exports = serverless(app);
