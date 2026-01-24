import express from 'express';
import fetch from 'node-fetch';
import xml2js from 'xml2js';

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// HOME
// =======================
app.get('/', (req, res) => {
  res.send('Quiniela oficial funcionando');
});

// =======================
// QUINIELA OFICIAL (SELAE)
// =======================
app.get('/api/quiniela.js', async (req, res) => {
  try {
    const url = 'https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml';

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error('SELAE no responde');
    }

    const xml = await response.text();

    const parser = new xml2js.Parser({ explicitArray: false });
    const data = await parser.parseStringPromise(xml);

    const sorteo = data?.quiniela?.sorteo;
    const partidosXML = sorteo?.partidos?.partido || [];

    const partidos = partidosXML.map(p => ({
      local: p.local,
      visitante: p.visitante,
      signo: p.signo
    }));

    const salida = {
      jornada: sorteo?.jornada || null,
      fecha: sorteo?.fecha || null,
      partidos
    };

    res.type('application/javascript');
    res.send(`window.QUINIELA_OFICIAL = ${JSON.stringify(salida)};`);

  } catch (e) {
    res.type('application/javascript');
    res.send(
      'window.QUINIELA_OFICIAL = {"error":"No disponible","partidos":[]};'
    );
  }
});

// =======================
app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
