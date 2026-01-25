import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

/* =========================
   API QUINIELA OFICIAL
========================= */
app.get('/api/quiniela.js', async (req, res) => {
  try {
    // ⚠️ aquí luego puedes cambiar a Cloudflare si quieres
    const url = 'https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml';

    const r = await fetch(url);
    if (!r.ok) throw new Error('No disponible');

    const xml = await r.text();

    // por ahora devolvemos crudo (o fallback)
    res.type('application/javascript');
    res.send(`
      window.QUINIELA_OFICIAL = {
        origen: "render",
        xml: \`${xml.replace(/`/g, '\\`')}\`
      };
    `);
  } catch (e) {
    res.type('application/javascript');
    res.send(`
      window.QUINIELA_OFICIAL = {
        error: "No disponible",
        partidos: []
      };
    `);
  }
});

/* =========================
   API COMPETICIÓN FÚTBOL
========================= */
app.get('/api/competicion/:code.js', async (req, res) => {
  const { code } = req.params;

  try {
    const API_KEY = process.env.FOOTBALL_API_KEY;

    const url = `https://api.football-data.org/v4/competitions/${code}/matches`;
    const r = await fetch(url, {
      headers: { 'X-Auth-Token': API_KEY }
    });

    if (!r.ok) throw new Error('Error API fútbol');

    const data = await r.json();

    res.type('application/javascript');
    res.send(`
      window.DATOS_COMPETICION = ${JSON.stringify(data)};
    `);
  } catch (e) {
    res.type('application/javascript');
    res.send(`
      window.DATOS_COMPETICION = {
        error: "No disponible",
        matches: []
      };
    `);
  }
});

/* =========================
   ROOT
========================= */
app.get('/', (req, res) => {
  res.send('Backend Quiniela + Fútbol OK');
});

app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
