const fetch = require('node-fetch');
const xml2js = require('xml2js');

module.exports = function(app){

  app.get('/quiniela.js', async (req, res) => {
    try{
      const url = 'https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml';
      const xml = await fetch(url).then(r=>r.text());

      const parsed = await xml2js.parseStringPromise(xml);

      res.type('application/javascript');
      res.send(`window.QUINIELA_OFICIAL = ${JSON.stringify(parsed)};`);

    }catch(e){
      res.type('application/javascript');
      res.send(`window.QUINIELA_OFICIAL = null;`);
    }
  });

};
