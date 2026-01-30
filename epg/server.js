const express = require("express");
const fetch = require("node-fetch");
const zlib = require("zlib");
const path = require("path");

const app = express();
const PORT = 3000;

const EPG_URL =
  "https://raw.githubusercontent.com/davidmuma/EPG_dobleM/master/guiatv.xml";

let cacheXML = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000;

// Servir frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/epg", async (req, res) => {
  try {
    const now = Date.now();

    if (cacheXML && now - cacheTime < CACHE_TTL) {
      res.set("Content-Type", "application/xml");
      return res.send(cacheXML);
    }

    console.log("Descargando EPG...");

    const response = await fetch(EPG_URL);
    const xml = await response.text();

    cacheXML = xml;
    cacheTime = now;

    res.set("Content-Type", "application/xml");
    res.send(xml);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error cargando EPG");
  }
});

app.listen(PORT, () => {
  console.log(`EPG activo en http://localhost:${PORT}`);
});
