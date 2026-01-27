const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

(async () => {
  try {
    const r = await fetch('https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml');
    const xmlText = await r.text();

    const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:'' });
    const xml = parser.parse(xmlText);

    console.log(JSON.stringify(xml, null, 2));
  } catch(e) {
    console.error('Error:', e);
  }
})();
