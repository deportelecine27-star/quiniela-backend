console.log('🔥 BACKEND QUINIELA FUNCIONAL 🔥');

const express = require('express');
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// QUINIELA (LEER XML LOCAL -> JSON)
// ================================
app.get('/api/quiniela.js', (req, res) => {
  res.type('application/javascript');

  try {
    const xmlPath = path.join(__dirname, 'data', 'quiniela.xml');
    const xmlText = fs.readFileSync(xmlPath, 'utf-8');

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const xml = parser.parse(xmlText);

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
    console.error('Error leyendo XML local:', e.message);
    res.send('window.DATOS_QUINIELA = { jornada: null, matches: [] };');
  }
});

// ================================
app.get('/', (req, res) => res.send('API OK'));

// ================================
app.listen(PORT, () => console.log('Servidor activo en puerto', PORT));
