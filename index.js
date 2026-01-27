console.log('🔥 BACKEND REMONTANDO 🔥');

const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

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
    console.error('Error clasificación:', e.message);
    res.type('application/javascript');
    res.send('window.DATOS_COMPETICION = null;');
  }
});

// ================================
// QUINIELA (SIMULACIÓN / LOCAL XML)
// ================================
app.get('/api/quiniela.js', (req, res) => {
  res.type('application/javascript');

  try {
    // Intentar leer XML local
    const xmlPath = path.join(__dirname, 'data', 'quiniela.xml');
    if (fs.existsSync(xmlPath)) {
      const xmlText = fs.readFileSync(xmlPath, 'utf-8');
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
      const xml = parser.parse(xmlText);

      const matches = (xml?.partidos?.partido || []).map((p, i) => ({
        homeTeam: { shortName: p.local || `Local ${i+1}` },
        awayTeam: { shortName: p.visitante || `Visitante ${i+1}` },
        score: {
          fullTime: { home: p.resultado_local || null, away: p.resultado_visitante || null }
        },
        status: 'FINISHED'
      }));

      const jornada = xml?.jornada || `J${new Date().getDate()}`;

      return res.send(`window.DATOS_QUINIELA = {
        jornada: "${jornada}",
        matches: ${JSON.stringify(matches)}
      };`);
    }

    // Si no hay XML, generar datos simulados
    const matchesSim = Array.from({ length: 14 }, (_, i) => ({
      homeTeam: { shortName: `Local ${i+1}` },
      awayTeam: { shortName: `Visitante ${i+1}` },
      score: { fullTime: { home: null, away: null } },
      status: 'PENDING'
    }));
    const jornadaSim = `J${new Date().getDate()}`;

    res.send(`window.DATOS_QUINIELA = {
      jornada: "${jornadaSim}",
      matches: ${JSON.stringify(matchesSim)}
    };`);

  } catch (e) {
    console.error('Error quiniela:', e.message);
    res.send('window.DATOS_QUINIELA = { jornada: null, matches: [] };');
  }
});

// ================================
app.get('/', (req, res) => res.send('API OK'));

// ================================
app.listen(PORT, () => console.log('Servidor activo en puerto', PORT));
