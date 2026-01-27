console.log('🔥 ESTE INDEX ES EL BUENO 🔥');

const express = require('express');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// QUINIELA (SELAE XML -> JSON)
// ================================
app.get('/api/quiniela.js', async (req, res) => {
  res.type('application/javascript');

  try {
    const r = await fetch('https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml');
    if (!r.ok) throw new Error('SELAE no responde');

    const xmlText = await r.text();

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const xml = parser.parse(xmlText);

    // Convertimos a formato simple para frontend
    const matches = (xml?.partidos?.partido || []).map(p => ({
      homeTeam: { shortName: p.local },
      awayTeam: { shortName: p.visitante },
      score: {
        fullTime: { home: p.resultado_local || null, away: p.resultado_visitante || null }
      },
      status: 'FINISHED'
    }));

    const jornada = xml?.jornada || null;

    res.send(`window.DATOS_QUINIELA = {
      jornada: "${jornada}",
      matches: ${JSON.stringify(matches)}
    };`);

  } catch (e) {
    console.error('Error quiniela:', e.message);
    res.send('window.DATOS_QUINIELA = { jornada: null, matches: [] };');
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
