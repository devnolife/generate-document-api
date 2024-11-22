const express = require('express');
const route = require('./routes/index');
const server = express();
const PORT = 8080;
const cors = require('cors');

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

server.use('/api', route);

server.get('/', (req, res) => {
  res.send('Welcome to the Document generator API by devnolife');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
