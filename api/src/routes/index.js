const { Router } = require('express');
const db = require('../db');
const pokemonController = require('../controllers/pokemonController');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers

// Ruta para obtener todos los pokemones
router.get('/pokemons', async (req, res) => {
    try {
      const pokemones = await db.Pokemon.findAll();
      res.json(pokemones);
    } catch (error) {
      console.error('Error al obtener los pokemones desde la base de datos:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los pokemones desde la base de datos' });
    }
  });

// Ruta para obtener el detalle de un pokemon específico por su ID
router.get('/pokemons/:idPokemon', pokemonController.getPokemonById);




module.exports = router;
