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
// QUINIELA (JSON ESTÁTICO)
// ================================
app.get('/api/quiniela.js', (req, res) => {
  res.type('application/javascript');

  // JSON de ejemplo, reemplazar con la jornada real manualmente
  const datosQuiniela = {
    jornada: 1,
    matches: [
      { homeTeam: 'Equipo A', awayTeam: 'Equipo B', status: 'FINISHED', score: { home: 1, away: 2 } },
      { homeTeam: 'Equipo C', awayTeam: 'Equipo D', status: 'FINISHED', score: { home: 0, away: 0 } },
      { homeTeam: 'Equipo E', awayTeam: 'Equipo F', status: 'FINISHED', score: { home: 3, away: 1 } },
      // ... hasta 14 partidos
      { homeTeam: 'Pleno Local', awayTeam: 'Pleno Visitante', status: 'FINISHED', score: { home: 2, away: 1 } } // pleno 15
    ]
  };

  res.send(`window.DATOS_QUINIELA = ${JSON.stringify(datosQuiniela)};`);
});

// ================================
app.get('/', (req, res) => {
  res.send('API OK');
});

// ================================
app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
