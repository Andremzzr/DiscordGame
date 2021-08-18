const mongoose = require("mongoose");


const PokemonSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true
    },
    pokemonId : {
        type: Number,
        required: true
    },
    pokemonName : {
        type: String,
        required: true
    },
    pokemonAbility: {
        type: String,
        required : true
    }
    
});


const Pokemon = mongoose.model('Pokemon', PokemonSchema);

module.exports = Pokemon;