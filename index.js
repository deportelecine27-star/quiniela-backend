import express from 'express';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// URL OFICIAL SELAE (resultados quiniela)
const SELAE_URL =
  'https://www.loteriasyapuestas.es/es/resultados/quiniela';

app.get('/quiniela.js', async (req, res) => {
  try {
    const r = await fetch(SELAE_URL);
    const xml = await r.text();

    const parser = new XMLParser();
    const data = parser.parse(xml);

    // 🔎 AJUSTE defensivo (estructura cambia según jornada)
    const partidos =
      data?.quiniela?.jornada?.partidos?.partido ||
      data?.jornada?.partidos?.partido ||
      [];

    const salida = {
      jornada: data?.quiniela?.jornada?.numero || null,
      partidos: partidos.map(p => ({
        local: p.local,
        visitante: p.visitante,
        signo: p.signo
      }))
    };

    res.type('application/javascript');
    res.send(`window.QUINIELA_OFICIAL = ${JSON.stringify(salida)};`);
  } catch (e) {
    res.type('application/javascript');
    res.send(
      `window.QUINIELA_OFICIAL = { error: "No se pudo cargar SELAE" };`
    );
  }
});

app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
