console.log('🔥 ESTE INDEX ES EL BUENO 🔥');

const express = require('express');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// ================================
// API FÚTBOL (CLASIFICACIÓN)
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
// QUINIELA (SELAE XML -> JSON LIMPIO)
app.get('/api/quiniela.js', async (req, res) => {
  try {
    const r = await fetch('https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml', { timeout: 8000 });
    if (!r.ok) throw new Error('SELAE no responde');
    const xmlText = await r.text();

    const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:'' });
    const xml = parser.parse(xmlText);

    // Extraemos jornada y partidos
    const jornada = xml.resultados.jornada || null;
    const partidos = xml.resultados.partido
      ? xml.resultados.partido.map(p => ({
          home: p.local,
          away: p.visitante,
          status: 'FINISHED',
          score: { home: p.marcador_local || null, away: p.marcador_visitante || null }
        }))
      : [];

    res.type('application/javascript');
    res.send(`window.DATOS_QUINIELA = ${JSON.stringify({ jornada, matches: partidos })};`);
  } catch(e) {
    res.type('application/javascript');
    res.send('window.DATOS_QUINIELA = { jornada:null, matches:[] };');
  }
});

// ================================
app.get('/', (req, res) => res.send('API OK'));

// ================================
app.listen(PORT, () => console.log('Servidor activo en puerto', PORT));
