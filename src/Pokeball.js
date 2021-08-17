module.exports = class Pokeball{
    constructor(name){
        this._name = name;
    }

    getName(){
        return this._name;
    }
    
    getPrice(){
        switch (this.getName()) {
            case 'normal':
                return 10; 
                
            case 'great':
                return 20;
            
            case 'master': 
                return 25;

            case 'ultra':
                return 100

            default:
                break;
        }
    }

    getChance(){
        switch (this.getName()) {
            case 'normal':
                return 35; 
                
            case 'great':
                return 45;
            
            case 'master': 
                return 60;

            case 'ultra':
                return 100;

            default:
                break;
        }
    }
}