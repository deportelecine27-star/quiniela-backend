// mini-quiniela.js
const express = require('express');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => res.send('Mini Quiniela SELAE OK'));

// Endpoint que devuelve los datos de la quiniela
app.get('/api/quiniela.js', async (req, res) => {
  res.type('application/javascript');

  try {
    const r = await fetch('https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml', { timeout: 8000 });
    if (!r.ok) throw new Error('SELAE no responde');

    const xmlText = await r.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const xml = parser.parse(xmlText);

    const jornada = xml?.quiniela?.jornada || null;
    const partidosRaw = xml?.quiniela?.partidos?.partido || [];

    const matches = partidosRaw.map(p => ({
      homeTeam: { shortName: p.equipoLocal || 'LOCAL' },
      awayTeam: { shortName: p.equipoVisitante || 'VISITANTE' },
      score: {
        fullTime: {
          home: p.marcadorLocal !== undefined ? parseInt(p.marcadorLocal) : null,
          away: p.marcadorVisitante !== undefined ? parseInt(p.marcadorVisitante) : null
        }
      },
      status: 'FINISHED'
    }));

    res.send(`window.DATOS_QUINIELA = { jornada: "${jornada}", matches: ${JSON.stringify(matches)} };`);

  } catch (e) {
    console.error(e);
    res.send('window.DATOS_QUINIELA = { jornada:null, matches:[] };');
  }
});

app.listen(PORT, () => console.log(`Mini Quiniela SELAE activo en puerto ${PORT}`));
