import express from 'express';
import fetch from 'node-fetch';

const app = express();

// 🔹 Render asigna el puerto automáticamente
const PORT = process.env.PORT || 3000;

// Ruta de prueba para la quiniela
app.get('/api/test', async (req, res) => {
  try {
    const r = await fetch('https://api.football-data.org/v4/competitions/PD', {
      headers: { 'X-Auth-Token': 'TU_API_KEY_AQUI' } // <- reemplaza tu API key
    });
    const data = await r.json();
    res.json(data.currentSeason);
  } catch (e) {
    res.status(500).json({ error: 'API error' });
  }
});

// Ejemplo de ruta que devuelve partidos
app.get('/api/quiniela', async (req, res) => {
  try {
    const r = await fetch(`https://api.football-data.org/v4/competitions/PD/matches`, {
      headers: { 'X-Auth-Token': 'TU_API_KEY_AQUI' } // <- reemplaza tu API key
    });
    const data = await r.json();
    res.json(data); // devuelve todos los partidos
  } catch (e) {
    res.status(500).json({ error: 'API error' });
  }
});

// 🔹 Escuchar en el puerto correcto
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
