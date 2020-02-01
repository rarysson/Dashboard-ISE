# ISE - Informando Sobre Educação

## Sobre o projeto
Esse projeto tem o intuito de mostrar os dados acerca das [notas educacionais do IDEB](http://portal.inep.gov.br/web/guest/educacao-basica/ideb/resultados) através de um dashboard.

O projeto mostra os dados dos seguintes locais:
* Brasil.
* Todos estados.
* Todas as cidades.
* Todas as escolas.
* As melhores escolas de uma cidade específica.

## Ferramentas usadas
* [Vue.js](vuejs.org/)
* [Vuetify](https://vuetifyjs.com/)
* [Google Charts](https://developers.google.com/chart)
* [Google Maps API](https://cloud.google.com/maps-platform/maps/) - requisito para usar geochart-geojson.
* [geochart-geojson](https://github.com/rarylson/geochart-geojson) - usado para criar os mapas dos estados e cidades.
* [municipal-brazilian-geodata](https://github.com/luizpedone/municipal-brazilian-geodata) - usado para saber os limites dos estados e cidades.
* [Municipios-Brasileiros](https://github.com/kelvins/Municipios-Brasileiros) - usado para saber o código IBGE, latitute e longitude das cidades.

## Rodando a aplicação
Para usar basta acessar o link do [Heroku](https://dashboard-ise.herokuapp.com/).

Para rodar localmente, basta clonar o projeto e executar os comandos
```
npm install
npm run serve
```

## Participantes
* [Rarysson](https://github.com/rarysson) [[Front-end]](https://github.com/rarysson/Dashboard-ISE)
* [Camila](https://github.com/Camila-Perin)  [[Back-end]](https://github.com/rarysson/ise-back)
