const handleActivitie = require('../activities/handleActivities');

module.exports =  {

    commandPoints : (Player, message, playerId) => {
        Player.find({playerId : playerId})
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

    /**
     * Buys a pokeball
     * @param {Model} Player 
     * @param {Model} Pokeball 
     * @param {Object} message 
     * @param {String} playerId 
     * @param {Array} args 
     * @returns 
     */
    buyCommand : (Player,Pokeball,message,playerId,args) => {
        if(Number.isInteger(args[1]) == true){
            message.reply("The pokeballs name is invalid");
            return;
        }
        const newPokeball = new Pokeball(args[1]);
        
        Player.findOne({playerId: playerId})
        .then(  
            player => {
                const playerPoints = player.points;
                let playerPokeBalls= player.pokeballs;
                playerPokeBalls[newPokeball.getIndex()]+= parseInt(args[0]);

                if(playerPoints < args[0] * newPokeball.getPrice()){
                    message.reply("You don't have enough points");
                }  
                else{
                    Player.updateOne({playerId : playerId}, {
                        
                        points : playerPoints - (args[0] * newPokeball.getPrice()),
                        pokeballs: playerPokeBalls 
                        
                        }, (err)=>{
                            if(err){
                                message.reply("An error occured, try to fill the right arguments");
                                console.log(err);
                                return;
                            }

                            message.reply(`You bougth ${args[0]} pokeballs ${args[1]} :baseball:`);
                        }
                    )
                    .then(player => console.log(`Player ${playerId} updated`));     
                }
            }
        )
    },
    /**
     * Send the Player's stats
     * @param {Model} Player 
     * @param {Object} message 
     * @param {String} playerId 
     * @param {Object} embed 
     */
    statsCommand : (Player,message,playerId,embed) => {
        Player.find({playerId : playerId})
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
                        \n:basketball: ultra: ${player[0].pokeballs[2]}
                        \n:crystal_ball: master: ${player[0].pokeballs[3]}
                        \n:no_entry: Pokemons: \n${player[0].pokemons.map(pokemon => pokemon.shiny == true ? pokemon.pokemonId + '=> ' + pokemon.name + '(Shiny)\n' : pokemon.pokemonId + '=> '+ pokemon.name + '\n')}
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

    /**
     * Player try to catch a pokemon
     * @param {String} pokemon 
     * @param {Model} Player 
     * @param {Object} message 
     * @param {String} playerId 
     * @param {Class} newPokeball 
     * @param {Object} Embed 
     */
    tryCatchCommand : (pokemon,Player,message,playerId,newPokeball,Embed) => {
    
        Player.findOne({playerId: playerId})
        .then(
            player => {
                const index = newPokeball.getIndex();
                let pokemonArray = player.pokemons;
                let pokeballs = player.pokeballs;
            
                if(pokeballs[index] > 0){
                    if(Math.floor(Math.random() * (100) + 1) >= newPokeball.getChance()){
                        pokeballs[index]-= 1;
                        message.reply("Oh, the pokemon runned away :(");
                        Player.updateOne({playerId : playerId}, {
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

                                
                                let isShiny;
                                if (pokeRequest.shiny == null){
                                    isShiny = false;
                                }
                                else{
                                    isShiny = true;
                                }
                                
                                const id = Math.floor(Math.random() * 999);
                                const newPokemon = {
                                    name:pokeRequest.name,
                                    type: pokeRequest.type,
                                    shiny : isShiny, 
                                    selling : false, 
                                    pokemonId: `${id}_${message.author.username}`,
                                    image: pokeRequest.image};
                                pokemonArray.push(newPokemon);
                                
                                Embed.setThumbnail(pokeRequest.thumb)
                                .setDescription(`Shiny: ${pokeRequest.shiny == undefined ? 'false' : pokeRequest.shiny}\nType: ${pokeRequest.type} ${pokeRequest.typeIcon}\n\n${pokeRequest.stats}\nId: ${id}_${message.author.username}`)
                                .setTitle(pokeRequest.name)
                                .setURL(`https://www.pokemon.com/br/pokedex/${linkName}`)
                                .setImage(pokeRequest.image)
                                .setTimestamp()

                                pokeballs[index]-= 1;
                                
                                handleActivitie(pokeRequest.image,`Caught a ${pokeRequest.name}`,player);

                                Player.updateOne({playerId : playerId}, {
                                    pokeballs : pokeballs,
                                    pokemons : pokemonArray,
                                    activities: player.activities
                                 }, (err)=>{console.log(`${message.author.id} updated:`); console.log(newPokemon);})

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

    pokeballPrices : (message) => message.reply(`normal: 10 pts\ngreat: 20 pts\nultra: 25 pts\nmaster: 400 pts\ncard: 500 pts`),

    /**
     * Player buys a card from a pokemon in their bag
     * @param {String} pokemonName 
     * @param {Object} message 
     * @param {Model} Player 
     * @param {Object} Embed 
     */
    buycard : (pokemonName,message,Player,Embed) => {
        Player.findOne({playerId: message.author.id})
        .then(
            player => {

                let pokemon;
                if(player.points < 500) {
                    message.reply("You don't have enough points");
                    return;
                }
                player.pokemons.map(pokemonIter => {
                    pokemonIter.name.includes('-') ? pokemonIter.name = pokemonIter.name.split('-')[0] : pokemonIter.name = pokemonIter.name;
                    if(pokemonIter.name == pokemonName){
                        pokemon = pokemonName;    
                    }   
                    }
                )
                if(pokemon == undefined){
                   message.reply('You dont have this pokemon')
                }
                else{
                    const card = require('../cards');
                    card(pokemonName)
                    .then(
                        cardRequest=>{
                            let cardsArray = player.cards;
                            
                            Embed
                            .setTitle(cardRequest.name)
                            .setImage(cardRequest.image)
                            .setTimestamp()

                            cardsArray.push({
                                name : cardRequest.name,
                                id : cardRequest.id,
                                image : cardRequest.image
                            });
                            
                            const points = player.points;

                            handleActivitie(cardRequest.image, `Bought a card: ${cardRequest.name}`,player);

                            Player.updateOne({playerId : message.author.id}, {
                                cards : cardsArray,
                                points : points - 500,
                                activities: player.activities
                             }, (err)=>{console.log("Player Updated")})

                             message.reply({ embeds: [Embed] });
                            
                        }
                    )

                }
            }
        )
        
        
    },

    /**
     * Player sells his pokemon
     * @param {Model} Player 
     * @param {Object} message 
     * @param {String} pokemonName 
     * @param {Integer} price 
     * @param {Model} Pokemon 
     * @returns 
     */
    sellPokemon: (Player,message,pokemonId,price,Pokemon) =>{
        if(price == undefined){
            message.reply('The price is null');
            return;
        }
        else if(Number.isInteger(parseInt(price)) == false){
            message.reply("You need to fill with a real price");
            return;
        }

        Player.find({playerId: message.author.id})
        .then(
            player => {
                let pokemonInsertId;
                
                player[0].pokemons.map(pokemonIter => {                    
                    if(pokemonIter.pokemonId == pokemonId){
                        pokemonInsertId = pokemonId;
                        pokemonIter.selling = true;

                    } 
                    }
                )

                
                if(pokemonInsertId == undefined){
                    message.reply("You don't have this pokemon")
                    return;
                }

                

                else{
                    let sellingPokemons=  player[0].pokemons.filter(pokemon => {
                        return pokemon.selling == true;
                     })
     
                    let newPokemons = player[0].pokemons.filter(pokemon => {
                         return pokemon.selling == false;
                    })

                    const pokemonObj = player[0].pokemons.filter(pokemon=> pokemon.pokemonId == pokemonInsertId);
                    console.log(pokemonObj);

                    
                    const newPokemon = new Pokemon({
                        playerId : message.author.id,
                        pokemonPrice: parseInt(price),
                        pokemonId : pokemonObj[0].pokemonId,
                        pokemonName: sellingPokemons[0].name,
                        image : sellingPokemons[0].image,
                        type:  sellingPokemons[0].type,
                        shiny : sellingPokemons[0].shiny
                    });

                    handleActivitie(sellingPokemons[0].image,`Sold a ${sellingPokemons[0].name}`,player[0]);

                    newPokemon.save()
                    .then(pokemon => console.log(`Pokemon saved: ${pokemon.pokemonId}`))
                    .catch(err => console.log(`Error: ${err}`));

                    Player.updateOne({playerId : message.author.id}, {
                        pokemons : newPokemons,
                        activities: player[0].activities
                     }, (err)=>{ message.reply(`Your pokemon ${sellingPokemons[0].name} is on sale for ${price} pts!`)})
                }
            }
        )
    },


    market : (Pokemon,message) => {
        Pokemon.find()
        .then(
            pokemon =>{
                let mssg = ``;
                pokemon.forEach(element => {
                   mssg += `pokemon: ${element.pokemonName}\nid: ${element.pokemonId}\n:coin: ${element.pokemonPrice}\n\n`;
                });

                if(mssg == ''){
                    message.reply("There's no pokemon on the market")
                    return;
                }else{

                    message.reply(mssg);
                }
            }
        )
        .catch(err => console.log(err));
    },

    /**
     * Player buys a pokemon from the market
     * @param {Object} message 
     * @param {Model} Player 
     * @param {Model} Pokemon 
     * @param {String} id 
     */
    buypokemon : (message,Player,Pokemon,id) => {
        Pokemon.find({pokemonId: id})
        .then(
            pokemon => {
                Player.find({playerId: message.author.id})
                .then(
                    buyer => {
                        if(buyer[0].points < pokemon[0].pokemonPrice){
                            message.reply("You don't have enough points");
                            return;
                        }
                        
                        if(message.author.id == pokemon[0].playerId){
                            message.reply("You can't buy this pokemon, you're the current owner!");
                            return;
                        }

                        
                        let pokemonArray = buyer[0].pokemons;
                        pokemonArray.push({
                            name: pokemon[0].pokemonName,
                            type: pokemon[0].type,
                            image: pokemon[0].image,
                            shiny : pokemon[0].shiny,
                            selling: false
                        });

                        const buyerPoints = buyer[0].points;
                        handleActivitie(pokemon[0].image,`Bought a ${pokemon[0].Name}`,buyer);

                        Player.updateOne({playerId:message.author.id},{
                            pokemons : pokemonArray,
                            points : buyerPoints - pokemon[0].pokemonPrice,
                            activities: buyer.activities
                        }, err => message.reply(`You bought the ${pokemon[0].pokemonName} ${pokemon[0].pokemonId}`));

                        Player.find({playerId: pokemon[0].playerId})
                        .then(
                            owner =>{
                                
                                const ownerPoints = owner[0].points;
                                Player.updateOne({playerId: pokemon[0].playerId},{
                                    points: ownerPoints + pokemon[0].pokemonPrice
                                },err => console.log(`Player ${pokemon[0].playerId} receive ${ pokemon[0].pokemonPrice} pts!`) );   

                                Pokemon.deleteOne({pokemonId : id},err => console.log("Pokemon sold"))
                            }
                        )

                        
                    }
                )
            }
        )
    },

    /**
     * Create a new User if player isn't in the database
     * @param {Model} Player 
     * @param {Model} Comment 
     */
     enterGame : (Player,Comment,playerId,message) =>{
        Player.findOne({playerId : playerId})
        .then( playerThatSentMessage =>{
            if(playerThatSentMessage == undefined){
                const newPlayer = new Player({
                    playerId: playerId,
                    icon: message.author.avatar,
                    tag: message.author.tag,
                    points : message.content.length,
                });
        
                const newComment = new Comment({
                    playerId: playerId,
                    lastComment: new Date()
                })
                newPlayer.save()
                .then( player => {
                    console.log(`Player: ${player}`)
        
                    newComment.save()
                    .then(comment => console.log(`Comment: ${comment}`))
                    .catch(err => console.log(err));
        
                    message.reply("Congrats, you just entered into the pokemon world :D");
                })
                .catch(err => console.log(err));
            }
            else{
                message.reply("You are already into the game");
            }
        })
        
    },

    helpCommand: (message) => {
        const helpMsg = `$stats\n$prices\n$points\n$buypokeball [quantity ex: 1] [pokeball ex: ultra]\n$catch [pokeball ex: ultra]\n$buycard [pokemon's name]\n$sellpokemon [pokemon's id] [price ex :500]\n$buypokemon [pokemon's id]`;
        message.reply(helpMsg);
    }



}