console.log('🔥 Backend prueba quiniela 🔥');

const express = require('express');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint mínimo para quiniela
app.get('/api/quiniela-test', async (req, res) => {
  res.type('application/json'); // devolvemos JSON puro

  try {
    const r = await fetch('https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml', { timeout: 8000 });
    if(!r.ok) throw new Error('SELAE no responde');

    const xmlText = await r.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const data = parser.parse(xmlText);

    res.json(data);

  } catch(e) {
    console.error(e);
    res.json({ jornada:null, matches:[] });
  }
});

app.get('/', (req,res)=>res.send('API prueba quiniela OK'));

app.listen(PORT, ()=>console.log('Servidor activo en puerto', PORT));
