const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// ================================
// API FÚTBOL (CLASIFICACIÓN)
// ================================
app.get('/api/competicion/:code.js', async (req, res) => {
  try {
    const code = req.params.code;

    const r = await fetch(
      `https://api.football-data.org/v4/competitions/${code}/matches`,
      { headers: { 'X-Auth-Token': API_KEY } }
    );

    const data = await r.json();

    res.type('application/javascript');
    res.send('window.DATOS_COMPETICION = ' + JSON.stringify(data));

  } catch (e) {
    res.type('application/javascript');
    res.send('window.DATOS_COMPETICION = null;');
  }
});

// ================================
// QUINIELA (placeholder seguro)
// ================================
app.get('/quiniela.js', (req, res) => {
  res.type('application/javascript');
  res.send(`
    window.QUINIELA_OFICIAL = {
      jornada: null,
      partidos: []
    };
  `);
});

// ================================
app.get('/', (req, res) => {
  res.send('API OK');
});

app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
