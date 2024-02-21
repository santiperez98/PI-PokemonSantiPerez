const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');
const db = require('./db');
const routes = require('./routes/index.js');

require('./db.js');

const server = express();

server.name = 'API';

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', routes); // Monta las rutas definidas en routes/index.js en la ruta base '/'

// Función para obtener y guardar los datos de la API de Pokémon
// Función para obtener y guardar los datos de la API de Pokémon
async function obtenerYGuardarPokemones() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
    const pokemones = response.data.results.map(pokemon => ({
      nombre: pokemon.name,
      imagen: 'URL_IMAGEN',
       // Asignar un valor predeterminado, por ejemplo 100
      // Puedes incluir las demás propiedades del Pokémon aquí
    }));
    // Guardar los pokemones en la base de datos
    await db.Pokemon.bulkCreate(pokemones);
    console.log('Pokemones guardados en la base de datos.');
  } catch (error) {
    console.error('Error al obtener y guardar los pokemones:', error);
  }
}

obtenerYGuardarPokemones();

// Error catching endware.
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
