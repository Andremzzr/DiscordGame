const axios = require('axios');

const cardRequest = async (name) =>{

    const getCard = await axios.get(
        `https://api.pokemontcg.io/v1/cards?name=${name}`
        ).then(total => {
            const cards = total.data.cards;
            const index =Math.floor(Math.random() * cards.length ); 
            
           return {
               name: cards[index].name,
               id : cards[index].id,
               image: cards[index].imageUrl
            }
        }).catch( err => {
            console.log(err);
        }); 
    
    
        return getCard;
        
}





module.exports = cardRequest;