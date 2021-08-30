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
            
            case 'ultra': 
                return 25;

            case 'master':
                return 400

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
            
            case 'ultra': 
                return 30;

            case 'master':
                return 90;

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
            case 'ultra':
                return  2;
            case 'master':
                return  3;
            default:
                break;
        }
    }
}