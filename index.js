console.log('🔥 ESTE INDEX ES EL BUENO 🔥');

const express = require('express');
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
// QUINIELA (SELAE XML -> JSON)
// ================================
app.get('/api/quiniela.js', async (req, res) => {
  res.type('application/javascript');

  try {
    const r = await fetch(
      'https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml',
      { method: 'GET' }
    );

    if (!r.ok) throw new Error('SELAE no responde');

    const xmlText = await r.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ''
    });

    const xml = parser.parse(xmlText);

    // Convertimos a un formato simple: jornada y partidos
    // Ajusta según tu XML real
    const jornada =
      xml?.resultado?.jornada ||
      xml?.resultado?.numero_jornada ||
      null;

    const partidos =
      xml?.resultado?.partidos?.partido
        ? Array.isArray(xml.resultado.partidos.partido)
          ? xml.resultado.partidos.partido
          : [xml.resultado.partidos.partido]
        : [];

    res.send(
      `window.DATOS_QUINIELA = ${JSON.stringify({ jornada, matches: partidos })};`
    );
  } catch (e) {
    console.error('Error quiniela:', e.message);
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
