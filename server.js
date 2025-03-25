const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Start server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${server.address().port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // Port is in use, try a different port
    const newPort = port + 1;
    console.log(`Port ${port} is in use, trying port ${newPort}`);
    app.listen(newPort, () => {
      console.log(`Server running at http://localhost:${newPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
}); 