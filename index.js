const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

require('./server')(app);
require('./quiniela')(app);

app.get('/', (req, res) => {
  res.send('API OK');
});

app.listen(PORT, () => {
  console.log('🚀 Backend activo en puerto', PORT);
});
