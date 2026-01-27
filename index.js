console.log('🔥 INDEX QUINIELA FUNCIONAL 🔥');

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
    const r = await fetch('https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml', {
      timeout: 8000
    });

    if (!r.ok) throw new Error('SELAE no responde');

    const xmlText = await r.text();

    const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:'' });
    const xml = parser.parse(xmlText);

    // Transformamos a estructura más amigable para el front
    let jornada = null;
    let matches = [];

    if (xml.resultados && xml.resultados.jornada) {
      jornada = xml.resultados.jornada;
    }

    if (xml.resultados && xml.resultados.partido) {
      matches = Array.isArray(xml.resultados.partido)
        ? xml.resultados.partido
        : [xml.resultados.partido];

      // Extraemos solo lo necesario: local, visitante, marcador
      matches = matches.map(p => ({
        homeTeam: { shortName: p.equipo_local || 'Local' },
        awayTeam: { shortName: p.equipo_visitante || 'Visitante' },
        score: {
          fullTime: {
            home: p.goles_local !== undefined ? Number(p.goles_local) : null,
            away: p.goles_visitante !== undefined ? Number(p.goles_visitante) : null
          }
        },
        status: 'FINISHED'
      }));
    }

    res.send(`window.DATOS_QUINIELA = ${JSON.stringify({ jornada, matches })};`);
  } catch(e) {
    console.error('Error SELAE:', e);
    res.send(`window.DATOS_QUINIELA = { jornada:null, matches:[] };`);
  }
});

// ================================
// TEST BÁSICO
// ================================
app.get('/', (req, res) => {
  res.send('API Quiniela OK');
});

app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
