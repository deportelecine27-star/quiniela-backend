console.log('🔥 Servidor Quiniela seguro 🔥');

const express = require('express');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// Quiniela seguro
// ================================
app.get('/api/quiniela.js', async (req, res) => {
  res.type('application/javascript');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000); // 7s máximo

    const r = await fetch(
      'https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml',
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!r.ok) throw new Error('SELAE no responde');

    const xmlText = await r.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ''
    });

    const xml = parser.parse(xmlText);

    // Enviamos datos simples para test
    const matches = (xml?.quiniela?.partido || []).map((p, i) => ({
      id: i + 1,
      home: p.local || 'Local',
      away: p.visitante || 'Visitante',
      resultado: p.resultado || null
    }));

    const jornada = xml?.quiniela?.jornada || null;

    res.send(`window.DATOS_QUINIELA = ${JSON.stringify({ jornada, matches })};`);
  } catch (e) {
    console.error('Error Quiniela:', e.message);
    res.send(`window.DATOS_QUINIELA = { jornada: null, matches: [] };`);
  }
});

// ================================
// Ruta test fútbol minimal
// ================================
app.get('/api/competicion/test.js', (req, res) => {
  res.type('application/javascript');
  res.send('window.DATOS_COMPETICION = { test: true };');
});

// ================================
app.get('/', (req, res) => {
  res.send('API OK seguro');
});

// ================================
app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
