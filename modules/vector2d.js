export default class Vector2D{
    static up=new Vector2D(0,1);
    static down=new Vector2D(0,-1);
    static left=new Vector2D(-1,0);
    static right=new Vector2D(1,0);
    static zero=new Vector2D(0,0);
    constructor(x,y){
      this.x=x;
      this.y=y;
      this.magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
      this.sqrMagnitude=(this.x*this.x+this.y*this.y);
    }  
    normalize(){        
      this.x = this.x/this.magnitude; 
      this.y = this.y/this.magnitude;
      this.magnitude = Math.sqrt(this.x*this.x+this.y*this.y);
      this.sqrMagnitude=(this.x*this.x+this.y*this.y);
      return this;
    }
    toString(){
      let vector=[this.x,this.y];
      return vector.toString();
    }
    static set x(x){
      this.x=x;
      this.magnitude = Math.sqrt(this.x*this.x+this.y*this.y);
      this.sqrMagnitude=(this.x*this.x+this.y*this.y);
      return this;
    }
    static set y(y){
      this.y=y;    
      this.magnitude = Math.sqrt(this.x*this.x+this.y*this.y);
      this.sqrMagnitude=(this.x*this.x+this.y*this.y);
      return this;
    }
    set(x,y){
      this.x=x;
      this.y=y;
      this.magnitude = Math.sqrt(this.x*this.x+this.y*this.y);
      this.sqrMagnitude=(this.x*this.x+this.y*this.y);
      return this;
    }
    equals(vector){
      if(!(vector instanceof Vector2D)){return false;}
      if(this.x===vector.x&&this.y===vector.y){return true;}
    }
    static add(vector1,V2D){
      if(!(vector1 instanceof Vector2D)){return false;}
      if(!(V2D instanceof Vector2D)){return false;}
      let x=vector1.x+V2D.x;
      let y=vector1.y+V2D.y
      return new Vector2D(x,y);
    }
    scale(n){
      return new Vector2D(this.x*n,this.y*n);
    }
    static clone(vector){
      return new Vector2D(vector.x,vector.y);
    }
  }