const mongoose = require("mongoose");


const PlayerSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    tag:{
        type: String,
        required: true
    },
    points : {
        type: Number,
        required : true
    },
    pokeballs : {
        type: Array,
        default : [0,0,0,0]
    },
    pokemons: {
        type: Array,
        default: []
    },
    cards : {
        type: Array,
        default: []
    }
});


const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;