console.log('🔥 Servidor minimal funcionando 🔥');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Test fútbol
app.get('/api/competicion/test.js', (req, res) => {
  res.type('application/javascript');
  res.send('window.DATOS_COMPETICION = { test: true };');
});

// Test quiniela
app.get('/api/quiniela.js', (req, res) => {
  res.type('application/javascript');
  res.send('window.DATOS_QUINIELA = { jornada: 1, matches: [] };');
});

app.get('/', (req, res) => {
  res.send('API OK minimal');
});

app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
