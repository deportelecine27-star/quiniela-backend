import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ TU API KEY debe estar en Render como variable de entorno
const API_KEY = process.env.API_KEY;

// ENDPOINT PARA BLOGGER (JS EJECUTABLE)
app.get('/api/quiniela.js', async (req, res) => {
  try {
    const r = await fetch(
      'https://api.football-data.org/v4/competitions/PD/matches',
      {
        headers: {
          'X-Auth-Token': API_KEY,
          'User-Agent': 'quiniela-blogger'
        }
      }
    );

    const data = await r.json();

    if (!data || !Array.isArray(data.matches)) {
      throw new Error('Respuesta inválida');
    }

    res.setHeader('Content-Type', 'application/javascript');
    res.send(
      'window.DATOS_QUINIELA = ' + JSON.stringify(data)
    );
  } catch (err) {
    res.setHeader('Content-Type', 'application/javascript');
    res.send('window.DATOS_QUINIELA = null');
  }
});

// RUTA SIMPLE PARA SABER SI EL SERVER VIVE
app.get('/', (req, res) => {
  res.send('Backend Quiniela OK');
});

// 🔹 IMPRESCINDIBLE
app.listen(PORT, () => {
  console.log('Servidor activo en puerto ' + PORT);
});

