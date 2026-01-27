console.log('🔥 Backend Quiniela de prueba 🔥');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// API Fútbol (simulación clasificacion)
app.get('/api/competicion/:code.js', (req, res) => {
  const sampleData = {
    competition: req.params.code,
    matches: [
      { homeTeam: { shortName: 'RMA' }, awayTeam: { shortName: 'FCB' }, score: { fullTime: { home: 2, away: 1 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'ATM' }, awayTeam: { shortName: 'VAL' }, score: { fullTime: { home: 1, away: 1 } }, status: 'FINISHED' },
    ]
  };
  res.type('application/javascript');
  res.send(`window.DATOS_COMPETICION = ${JSON.stringify(sampleData)};`);
});

// ================================
// Quiniela (datos de prueba)
app.get('/api/quiniela.js', (req, res) => {
  const sampleQuiniela = {
    jornada: 12,
    matches: [
      { homeTeam: { shortName: 'RMA' }, awayTeam: { shortName: 'FCB' }, score: { fullTime: { home: 2, away: 1 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'ATM' }, awayTeam: { shortName: 'VAL' }, score: { fullTime: { home: 1, away: 1 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'SEV' }, awayTeam: { shortName: 'BET' }, score: { fullTime: { home: 0, away: 0 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'VIL' }, awayTeam: { shortName: 'CEL' }, score: { fullTime: { home: 1, away: 2 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'EIB' }, awayTeam: { shortName: 'GIR' }, score: { fullTime: { home: 3, away: 1 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'RAY' }, awayTeam: { shortName: 'GET' }, score: { fullTime: { home: 2, away: 2 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'VAL' }, awayTeam: { shortName: 'ALM' }, score: { fullTime: { home: 0, away: 1 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'BAR' }, awayTeam: { shortName: 'ATH' }, score: { fullTime: { home: 1, away: 3 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'ESP' }, awayTeam: { shortName: 'CEL' }, score: { fullTime: { home: 2, away: 2 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'OSAS' }, awayTeam: { shortName: 'VIL' }, score: { fullTime: { home: 1, away: 0 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'RMA' }, awayTeam: { shortName: 'SEV' }, score: { fullTime: { home: 3, away: 1 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'VAL' }, awayTeam: { shortName: 'BET' }, score: { fullTime: { home: 0, away: 0 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'GIR' }, awayTeam: { shortName: 'RAY' }, score: { fullTime: { home: 1, away: 2 } }, status: 'FINISHED' },
      { homeTeam: { shortName: 'GET' }, awayTeam: { shortName: 'ATH' }, score: { fullTime: { home: 2, away: 1 } }, status: 'FINISHED' },
      // Pleno al 15
      { homeTeam: { shortName: 'BAR' }, awayTeam: { shortName: 'RMA' }, score: { fullTime: { home: 3, away: 0 } }, status: 'FINISHED' },
    ]
  };

  res.type('application/javascript');
  res.send(`window.DATOS_QUINIELA = ${JSON.stringify(sampleQuiniela)};`);
});

// ================================
app.get('/', (req, res) => {
  res.send('API Quiniela de prueba OK');
});

// ================================
app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
