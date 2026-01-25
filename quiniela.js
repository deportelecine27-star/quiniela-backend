module.exports = function(app){

  app.get('/quiniela.js', (req, res) => {
    res.type('application/javascript');
    res.send(`
      window.DATOS_QUINIELA = {
        jornada: null,
        partidos: []
      };
    `);
  });

};



import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

export default async function handler(req, res) {
  try {
    // URL OFICIAL SELAE (ejemplo, cambia si es otra)
    const url = "https://www.loteriasyapuestas.es/servicios/resultados/quiniela.xml";

    const xml = await fetch(url).then(r => r.text());

    const parser = new XMLParser();
    const data = parser.parse(xml);

    // Aquí depende del XML real
    const partidos = data.quiniela.partido.map(p => ({
      local: p.local,
      visitante: p.visitante,
      signo: p.signo
    }));

    res.setHeader("Content-Type", "application/javascript");
    res.send(`
      window.QUINIELA_OFICIAL = ${JSON.stringify(partidos)};
    `);

  } catch (e) {
    res.send(`window.QUINIELA_OFICIAL = null;`);
  }
}
