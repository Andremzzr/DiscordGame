const axios = require('axios');

const pokeRequest = async () =>{
    let Icon;
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
    
    const typesEmoji = {
        normal : ':fish_cake:' ,
        fighting : ':boxing_glove:',
        flying: ':eagle:',
        poison: ':mushroom:',
        ground: ':desert:',
        rock: ':mountain:',
        bug: ':lady_beetle: ',
        ghost: ':ghost:',
        steel: ':mechanical_arm:',
        fire: ':fire:',
        water: ':droplet:',
        grass: ':four_leaf_clover:',
        electric: ':zap:',
        psychic: ':candy:',
        ice: ':snowflake:',
        dragon: ':dragon:',
        dark: ':dark_sunglasses:',
        fairy: ':woman_fairy:'
    }



    const getEmoji = type => {
        for (const key of Object.keys(typesEmoji)) {
            if(type == [key]){
                return typesEmoji[key];
            }
        }
    }

    function generateType(){
        let count = 1;
        let max = Math.floor(Math.random() * (18 - 1) + 1);
        for (const key of Object.keys(pokemonTypes)) {
            if(count == max){
                Icon = getEmoji(key);
                return pokemonTypes[key]
            }
            count++;
        }
    }

    const getTypes = (typeList) => {
        let count = 0;
        let typeArr =``; 
        for (const key of Object.keys(typeList)) {
            !count > 0 ? typeArr+=typeList[key].type.name : typeArr+=`/${typeList[key].type.name}`;
            count++;
        }

        return typeArr;
    }

    const getStats = stat => {
        let stats = ``;
        for (const key of Object.keys(stat)) {
            stats+=`- ${stat[key].stat.name}: ${stat[key].base_stat}\n`;
        }
        return stats;
    }
    
    const getPokemon = await axios.get(
        `https://pokeapi.co/api/v2/type/${generateType()}`
        ).then(total => {
           return {
                pokemons: total.data.pokemon
            }
        }).catch( err => {
            console.log(err);
        }); 
    
    const getPokemonInfo = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${getRandomPoke()}` 
    ).then(total => {
        const stats = getStats(total.data.stats);
        const Type = getTypes(total.data.types);
        return {
            name : total.data.name,
            type : Type,
            stats,
            typeIcon: Icon,
            image : total.data.sprites.front_default
        }
     }).catch( err => {
         console.log(err);
     }); 
 
    
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
    
    
    return getPokemonInfo
}

pokeRequest()

module.exports = pokeRequest;