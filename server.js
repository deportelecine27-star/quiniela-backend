const fetch = require('node-fetch');

module.exports = function(app){

  app.get('/api/competicion/:code.js', async (req, res) => {
    try{
      const code = req.params.code;
      const API_KEY = process.env.API_KEY;

      const r = await fetch(
        `https://api.football-data.org/v4/competitions/${code}/matches`,
        { headers:{ 'X-Auth-Token': API_KEY } }
      );

      const data = await r.json();

      res.type('application/javascript');
      res.send(`window.DATOS_COMPETICION = ${JSON.stringify(data)};`);

    }catch(e){
      res.type('application/javascript');
      res.send(`window.DATOS_COMPETICION = null;`);
    }
  });

};
