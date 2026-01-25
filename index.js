const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// cargar APIs
require('./server')(app);     // clasificación fútbol
require('./quiniela')(app);   // quiniela oficial

app.get('/', (req, res) => {
  res.send('API OK');
});

app.listen(PORT, () => {
  console.log('🚀 Backend activo en puerto', PORT);
});
