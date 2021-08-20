const mongoose = require("mongoose");


const PokemonSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true
    },
    pokemonPrice : {
        type: Number,
        required: true
    },
    pokemonId : {
        type: String,
        required: true
    },
    pokemonName : {
        type: String,
        required: true
    },
},{collection: 'pokemon'});


const Pokemon = mongoose.model('Pokemon', PokemonSchema);

module.exports = Pokemon;