const mongoose = require("mongoose");


const PlayerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    points : {
        type: Number,
        required : true
    },
    pokeballs : {
        type: Number,
        default : 0
    },
    pokemons: {
        type: Array,
        default: []
    }
});


const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;