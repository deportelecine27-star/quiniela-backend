import express from "express";
import fetch from "node-fetch";
import xml2js from "xml2js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/quiniela.js", async (req, res) => {
  try {
    const r = await fetch(
      "https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml"
    );

    const xml = await r.text();

    const parsed = await xml2js.parseStringPromise(xml, {
      explicitArray: false
    });

    const partidos =
      parsed?.quiniela?.partidos?.partido || [];

    const salida = {
      jornada: parsed?.quiniela?.jornada || null,
      partidos
    };

    res.type("application/javascript");
    res.send(
      `window.QUINIELA_OFICIAL = ${JSON.stringify(salida)};`
    );
  } catch (e) {
    res.type("application/javascript");
    res.send(
      `window.QUINIELA_OFICIAL = {"error":"No disponible","partidos":[]};`
    );
  }
});

app.listen(PORT);
