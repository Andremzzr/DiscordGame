module.exports =  {
    commandPoints : (Player, message, playerId) => {
        Player.find({id : playerId})
            .then(player => {
                if(player.length > 0){
                    message.reply(`You have ${player[0].points} points`);
                }
                else{
                    message.reply("You don't have any points");
                }

            })
            .catch(err => console.log(err))
    },
    buyCommand : (Player,Pokeball,message,playerId,args) => {
        const newPokeball = new Pokeball(args[1]);
        
        Player.find({id: playerId})
        .then(  
            player => {
                const playerPoints = player[0].points;
                let playerPokeBalls= player[0].pokeballs;
                playerPokeBalls[newPokeball.getIndex()]+= parseInt(args[0]);

                if(playerPoints < args[0] * newPokeball.getPrice()){
                    message.reply("You don't have enough points");
                }  
                else{
                    Player.updateOne({id : playerId}, {
                        
                        points : playerPoints - (args[0] * newPokeball.getPrice()),
                        pokeballs: playerPokeBalls 
                        
                        }, (err)=>{
                            message.reply(`You bougth ${args[0]} pokeballs ${args[1]} :baseball:`)
                            if(err){
                                console.log(err);
                            }
                        }
                    )
                    .then(player => console.log(`Player ${playerId} updated`));     
                }
            }
        )
    },
    statsCommand : (Player,message,playerId,embed) => {
        Player.find({id : playerId})
            .then(
                player => {
                    if(player.length == 0){
                        message.reply("You're not registred yet :(")
                    }
                    else{
                        embed.setThumbnail(message.author.avatarURL())
                        .setDescription(
                        `Player: ${message.author.username}
                        \n:coin: : ${player[0].points}
                        \nPokeballs:
                        \n:baseball: normal: ${player[0].pokeballs[0]}
                        \n:softball: greatball: ${player[0].pokeballs[1]}
                        \n:basketball: master: ${player[0].pokeballs[2]}
                        \n:crystal_ball: ultra: ${player[0].pokeballs[3]}
                        \n:no_entry: Pokemons :${player[0].pokemons.map(pokemon => ' ' + pokemon.name)}
                        \n:black_joker: Cards :${player[0].cards.map(card => ' ' + card.name)}`)
                        .setTitle('Stats')
                        .setTimestamp()

                        message.reply(
                            {embeds: [embed]}
                        )
                    }
                    
                }
            )
    },

    tryCatchCommand : (pokemon,Player,message,playerId,newPokeball,Embed) => {
    
        Player.find({id: playerId})
        .then(
            player => {
                const index = newPokeball.getIndex();
                let pokemonArray = player[0].pokemons;
                let pokeballs = player[0].pokeballs;
            
                if(pokeballs[index] > 0){
                    if(Math.floor(Math.random() * (100) + 1) >= newPokeball.getChance()){
                        pokeballs[index]-= 1;
                        message.reply("Oh, the pokemon runned away :(");
                        Player.updateOne({id : playerId}, {
                            pokeballs : pokeballs,
                            pokemons : pokemonArray
                         }, (err)=>{console.log("PlayerUpdated")})
                    }
                    else{
                        pokemon()
                        .then(
                            pokeRequest => {
                                let linkName;
                                pokeRequest.name.includes('-') ? linkName = pokeRequest.name.split('-')[0] : linkName = pokeRequest.name;

                                pokemonArray.push({name:pokeRequest.name, type: pokeRequest.type, shiny : pokeRequest.shiny})
                                
                                Embed.setThumbnail(pokeRequest.thumb)
                                .setDescription(`Shiny: ${pokeRequest.shiny == undefined ? 'false' : pokeRequest.shiny}\nType: ${pokeRequest.type} ${pokeRequest.typeIcon}\n\n${pokeRequest.stats}`)
                                .setTitle(pokeRequest.name)
                                .setURL(`https://www.pokemon.com/br/pokedex/${linkName}`)
                                .setImage(pokeRequest.image)
                                .setTimestamp()

                                pokeballs[index]-= 1;

                                Player.updateOne({id : playerId}, {
                                    pokeballs : pokeballs,
                                    pokemons : pokemonArray
                                 }, (err)=>{console.log("PlayerUpdated")})

                                message.reply({ embeds: [Embed] });
                            }
                        )
                    } 
                }
                else{
                    message.reply('You dont have enough pokeballs');
                }
                
            }
        )
    },

    pokeballPrices : (message) => message.reply(`normal: 10 pts\ngreat: 20 pts\nmaster: 25 pts\nultra: 500 pts\n card: 500 pts`),

    buycard : (pokemonName,message,Player,Embed) => {
        Player.find({id: message.author.id})
        .then(
            player => {

                let pokemonArray = [];
                if(player[0].points < 500) {
                    message.reply("You don't have enough points");
                    return;
                }
                const pokemon = player[0].pokemons.map(pokemonIter => {
                    
                    pokemonIter.name.includes('-') ? pokemonIter.name = pokemonIter.name.split('-')[0] : pokemonIter.name = pokemonIter.name;
                    if(pokemonIter.name == pokemonName){
                        pokemonArray.push(pokemonName);    
                    }
                    
                    }
                )
                
                console.log(pokemonArray);
                if(pokemonArray !== [] ){
                    const card = require('../cards');
                    card(pokemonName)
                    .then(
                        cardRequest=>{
                            let cardsArray = player[0].cards;
                            Embed
                            .setTitle(cardRequest.name)
                            .setImage(cardRequest.image)
                            .setTimestamp()

                            cardsArray.push({
                                name : cardRequest.name,
                                id : cardRequest.id,
                                image : cardRequest.image
                            });
                            const points = player[0].points;


                            Player.updateOne({id : message.author.id}, {
                                cards : cardsArray,
                                points : points - 500
                             }, (err)=>{console.log("Player Updated")})

                             message.reply({ embeds: [Embed] });

                            
                        }
                    )

                }
                else{
                    message.reply("You don't have this pokemon")
                }
            }
        )
        
        
    }
    

}