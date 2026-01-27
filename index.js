console.log('🔥 ESTE INDEX ES EL BUENO 🔥');

const express = require('express');

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
    res.send(`window.DATOS_COMPETICION = ${JSON.stringify(data)};`);

  } catch (e) {
    res.type('application/javascript');
    res.send('window.DATOS_COMPETICION = null;');
  }
});

// ================================
// QUINIELA (PROXY WORKER)
// ================================
app.get('/api/quiniela.js', async (req, res) => {
  try {
    // <-- Pega aquí la URL de tu Worker si cambia
    const workerUrl = 'https://fragrant-hill-4b44.deportelecine27.workers.dev/';

    const xmlJs = await fetch(workerUrl).then(r => r.text());

    res.type('application/javascript');
    res.send(xmlJs);

  } catch(e) {
    res.type('application/javascript');
    res.send('window.DATOS_QUINIELA = { jornada:null, matches:[] };');
  }
});

// ================================
app.get('/', (req, res) => {
  res.send('API OK');
});

// ================================
app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
