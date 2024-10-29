const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const cors =  require('cors');
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','assets','img','favicon.ico')));


// Handle HTML file request
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {  
  console.log(`Server running at http://localhost:${PORT}/`);
});
 