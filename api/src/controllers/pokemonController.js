const { Pokemon, Type } = require('../db');
const axios = require('axios');

// Funciones controladoras para las rutas relacionadas con los pokemones
const getAllPokemons = async (req, res) => {
    try {
      const pokemons = await Pokemon.findAll();
      res.json(pokemons);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al obtener los pokemones.' });
    }
  };

  const getPokemonById = async (req, res) => {
    const { idPokemon } = req.params;
  
    try {
      let pokemon = await Pokemon.findByPk(idPokemon, { include: Type });
      if (!pokemon) {
        // Si no se encuentra en la base de datos local, intenta obtenerlo de la API externa
        pokemon = await getPokemonByIdFromApi(idPokemon);
      }
  
      if (!pokemon) {
        return res.status(404).json({ message: 'No se encontró el Pokémon.' });
      }
  
      res.json(pokemon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al obtener el detalle del Pokémon.' });
    }
  };


  const searchPokemonsByName = async (req, res) => {
    const { name } = req.query;
  
    try {
      const pokemons = await Pokemon.findAll({
        where: { name: { [Sequelize.Op.iLike]: `%${name}%` } },
      });
  
      if (pokemons.length === 0) {
        return res.status(404).json({ message: 'No se encontraron pokemons con ese nombre.' });
      }
  
      res.json(pokemons);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al buscar los pokemones.' });
    }
  };

  const createPokemon = async (req, res) => {
    const { name, image, life, attack, defense, speed, height, weight, types } = req.body;
  
    try {
      // Crea el pokemon en la base de datos
      const newPokemon = await Pokemon.create({
        name,
        image,
        life,
        attack,
        defense,
        speed,
        height,
        weight,
      });
  
      // Asocia los tipos del pokemon
      await newPokemon.addTypes(types);
  
      res.status(201).json(newPokemon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al crear el pokemon.' });
    }
  };

  const getAllTypes = async (req, res) => {
    try {
      const types = await Type.findAll();
      if (types.length === 0) {
        // Si la base de datos está vacía, obtén los tipos de la API y guarda
        // en la base de datos antes de responder
        // Implementa la lógica aquí para obtener los tipos de la API y guardarlos en la base de datos
      } else {
        res.json(types);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al obtener los tipos de pokemones.' });
    }
  };
  const getPokemonByIdFromApi = async (pokemonId) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        return response.data; // Retorna los datos del Pokémon
    } catch (error) {
        if (error.response) {
            // La solicitud fue hecha y el servidor respondió con un código de estado diferente de 2xx
            console.error('Error en la respuesta de la API:', error.response.data);
            console.error('Código de estado:', error.response.status);
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error('No se recibió respuesta de la API:', error.request);
        } else {
            // Ocurrió un error al configurar la solicitud
            console.error('Error al configurar la solicitud:', error.message);
        }
        throw error; // Lanza el error para manejarlo en otro lugar si es necesario
    }
};

module.exports = {
  getAllPokemons,
  getPokemonById,
  searchPokemonsByName,
  createPokemon,
  getAllTypes,
  getPokemonByIdFromApi
};
