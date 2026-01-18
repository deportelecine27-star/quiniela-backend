import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'fcb1f56f7ca04fdc93a8bc8a9318a010';
const API = 'https://api.football-data.org/v4';

/* Ruta de prueba */
app.get('/api/test', async (req, res) => {
  try {
    const r = await fetch(`${API}/competitions/PD`, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const data = await r.json();
    res.json(data.currentSeason);
  } catch (e) {
    res.status(500).json({ error: 'API error' });
  }
});