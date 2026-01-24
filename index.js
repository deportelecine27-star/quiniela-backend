import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Quiniela oficial funcionando');
});

app.get('/api/quiniela.js', (req, res) => {
  res.type('application/javascript');
  res.send(
    'window.QUINIELA_OFICIAL = {"jornada":null,"partidos":[]};'
  );
});

app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});
