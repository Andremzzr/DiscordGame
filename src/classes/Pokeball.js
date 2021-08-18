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
                return 20; 
                
            case 'great':
                return 24;
            
            case 'master': 
                return 30;

            case 'ultra':
                return 60;

            default:
                break;
        }
    }

    getIndex(){
        switch (this.getName()) {
            case 'normal':
                return  0;
            case 'great':
                return  1;
            case 'master':
                return  2;
            case 'ultra':
                return  3;
            default:
                break;
        }
    }
}