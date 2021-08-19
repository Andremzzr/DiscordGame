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

    
    const typesEmoji = require('./emoji');
    const statsEmoji = require('./statsemoji');


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

    const isShiny = (data) => {
        const percentage = Math.floor(Math.random() * 100 + 1); 
        if(percentage <= 2){
            for (const key of Object.keys(data)) {
                if(key == 'front_shiny' || data[key] != null){
                    return true;
                }
                else{
                    return false
                }
            }
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
        let count  = 0;
        let emoji;
        for (const key of Object.keys(stat)) {
            if(statsEmoji[count][0] == stat[key].stat.name) {
                emoji = statsEmoji[count][1]
            }
            stats+=`${emoji} ${stat[key].stat.name}: ${stat[key].base_stat}\n`;
            count++;
        }
        return stats;
    }
    
    const getOfficalArtwork = (total) => {
        for(const key of Object.keys(total.data.sprites.other)){
            if(key == 'official-artwork'){
                return total.data.sprites.other[key].front_default;
            }
        }
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
        const thumb = getOfficalArtwork(total);
        const shiny = isShiny(total.data.sprites)
        let image;
        shiny == true ? image =  total.data.sprites.front_shiny : image = total.data.sprites.front_default;

        return {
            name : total.data.name,
            type : Type,
            stats,
            typeIcon: Icon,
            image : image,
            thumb: thumb,
            shiny: shiny
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
    
    return getPokemonInfo;
}




module.exports = pokeRequest;