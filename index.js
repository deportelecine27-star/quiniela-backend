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
    const url = 'https://raw.githubusercontent.com/TU_USUARIO/TU_REPO/main/proxy-quiniela.js';


const response = await fetch(url, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/xml,text/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9',
    'Connection': 'keep-alive'
  }
});


    if (!response.ok) {
      throw new Error('SELAE no responde');
    }

const textPreview = await response.text();

if (!textPreview.includes('<quiniela')) {
  throw new Error('No es XML de quiniela');
}

const xml = textPreview;


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
