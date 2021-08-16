const mongoose = require("mongoose");


const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    points : {
        type: Number,
        required : true
    },
    pokeballs : {
        type: Number
    },
    pokemons: {
        type: Array,
        default: []
    }
});


const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;