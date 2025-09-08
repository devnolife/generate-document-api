const express = require('express');
const path = require('path');
const route = require('./routes/index');
const frontendRoutes = require('./routes/frontend');
const server = express();
const PORT = 8080;
const cors = require('cors');

// Set view engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Static files
server.use(express.static(path.join(__dirname, 'public')));
server.use('/templates', express.static(path.join(__dirname, 'templates')));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

// Frontend routes
server.use('/', frontendRoutes);

// API routes  
server.use('/api', route);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
  console.log(`API endpoints at http://localhost:${PORT}/api`);
});
