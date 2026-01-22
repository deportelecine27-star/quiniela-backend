import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ TU API KEY debe estar en Render como variable de entorno
const API_KEY = process.env.API_KEY;

// ENDPOINT PARA BLOGGER (JS EJECUTABLE)
app.get('/api/competicion/:code.js', async (req, res) => {
  try {
    const code = req.params.code;

    const r = await fetch(
      `https://api.football-data.org/v4/competitions/${code}/matches`,
      { headers:{ 'X-Auth-Token': API_KEY } }
    );

    const data = await r.json();

    res.setHeader('Content-Type','application/javascript');
    res.send('window.DATOS_COMPETICION = '+JSON.stringify(data));

  } catch(e){
    res.setHeader('Content-Type','application/javascript');
    res.send('window.DATOS_COMPETICION = null');
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


