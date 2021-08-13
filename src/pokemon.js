const axios = require('axios');

const pokeRequest = async () =>{
    const pokemonTypes = {
        normal : 1,
        fighting : 2,
        flying: 3,
        poison: 4,
        ground: 5,
        rock: 6,
        bug: 7,
        ghost: 8,
        steel: 9,
        fire: 10,
        water: 11,
        grass: 12,
        electric: 13,
        psychic: 14,
        ice: 15,
        dragon: 16,
        dark: 17,
        fairy: 18
    }
    
    function generateType(){
        let count = 1;
        let max = Math.floor(Math.random() * (18 - 1) + 1);
        for (const key of Object.keys(pokemonTypes)) {
            if(count == max){
                return pokemonTypes[key]
            }
            count++;
        }
    }
    
    const getPokemon = await axios.get(
        `https://pokeapi.co/api/v2/type/${generateType()}`
        ).then(total => {
           return {
                name : total.data.name,
                pokemons: total.data.pokemon
            }
        }).catch( err => {
            console.log(err);
        }) 
    
     function getRandomPoke() {
        let count = 1;
        let max = Math.floor(Math.random() * (getPokemon.pokemons.length - 1) + 1);
        for (const key of Object.keys(getPokemon.pokemons)) {
            if(count == max){
                return getPokemon.pokemons[key].pokemon.name;
            }
            count++;
        }
    }
    
    return getRandomPoke();
}



module.exports = pokeRequest;