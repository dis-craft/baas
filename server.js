// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000; // you can change this if needed
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to parse JSON bodies and serve static files.
app.use(express.json());
app.use(express.static('public'));

// Helper function to read data from the JSON file.
function readData() {
  // If the file does not exist, initialize it with an empty array.
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
  }
  const data = fs.readFileSync(dataFilePath, 'utf8');
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Error parsing data file:', err);
    return [];
  }
}

// Helper function to write data to the JSON file.
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// API endpoint to fetch stored student data.
app.get('/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// API endpoint to add new student data.
app.post('/data', (req, res) => {
  const { name, usn, section } = req.body;
  if (!name || !usn || !section) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const data = readData();
  data.push({ name, usn, section });
  writeData(data);
  res.json({ message: 'Data added successfully', data });
});

// Start the server.
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
