fetch("https://www.loteriasyapuestas.es/servicios/xml/resultados/quiniela.xml")
  .then(r => r.text())
  .then(xml => {
    document.write(xml);
  })
  .catch(() => {
    document.write("<error>No disponible</error>");
  });
