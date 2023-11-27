import Vector2D from "./vector2d.js";

export default class Hexagon{
    constructor(c,options){
      //radius,stroke,fill,strokeSize
      this.r=options?.radius||32;//radius
      this.d=this.r*2;//diameter
      this.position=new Vector2D(0,0);    
      this.sides=6;
      this.a=2 * Math.PI / this.sides;//angles as radians
      this.flipBit=1;//next targetY direction, -1 or 1
      this.startPosition=new Vector2D(this.position.x,this.position.y);
      this.starterBit=this.flipBit;
      this.strokeSize=options?.strokeSize||4;
      this.strokeColor=options?.stroke||"hsl(75 100% 50%)";
      this.fillColor=options?.fill||"hsl(280 100% 50%)";
      this.target=new Vector2D(0,0);
      this.canvas=c;
      this.context=null;
      this.setCanvas(c);
    }
    setCanvas(c){
      this.canvas=c;
      this.context=this.canvas.getContext("2d");
    }
    updateFlipBit(){       
      this.flipBit*=-1;
    }
    updateTargetX(){
      this.target.x=this.position.x+Math.floor(this.r+this.r*Math.cos(this.a));
    }
    updateTargetY(){    
      if(this.flipBit===1){
        this.target.y=this.position.y+Math.floor(this.r*Math.sin(this.a));
      }else{
        this.target.y=this.position.y-Math.floor(this.r*Math.sin(this.a));     
      }      
    }
    resetPosition(){    
        this.position=Vector2D.clone(this.startPosition); //use clone to avoid reference issues     
        this.flipBit=this.starterBit;
        this.previousFlip=this.starterBit;
        this.updateTargetY();
        this.updateTargetX(); 
    }
    nextRow(){
      this.position.x=this.startPosition.x;
      this.position.y+=Math.floor(this.d*Math.sin(this.a));//math.sin(this.a) accounts for height properly  
      if(this.flipBit===-1) this.position.y-=Math.floor(this.r*Math.sin(this.a));//fix y if on wrong flip bit during resize
      this.flipBit=this.starterBit;//reset flip bit every row to correct for resizing
      this.previousFlip=this.starterBit;
      this.updateTargetY();
      this.updateTargetX(); 
    }
    update(){
      if(this.previousFlip===this.flipBit) this.updateFlipBit();
      if(this.position.x<this.target.x) this.position.x+=Math.floor(this.r+this.r*Math.cos(this.a));
      if(this.position.x>this.target.x) this.position.x=this.target.x;
      if(this.position.x===this.target.x) this.updateTargetX();
      if(this.position.y<this.target.y) this.position.y+=Math.floor(this.r*Math.sin(this.a));
      if(this.position.y>this.target.y) this.position.y=this.target.y;
      if(this.position.y===this.target.y) this.updateTargetY();    
      if(this.position.x>=this.canvas.width+this.d) this.nextRow(); //nextrow if off canvas x
      if(this.position.y>=this.canvas.height+this.d) this.resetPosition(); //reset if off canvas y
      this.previousFlip=this.flipBit;
    }
    draw(){
      this.context.beginPath();
      this.context.strokeStyle=this.strokeColor;
      this.context.fillStyle=this.fillColor;
      this.context.lineWidth=this.strokeSize;
      for (let i = 0; i < this.sides; i++) this.context.lineTo(this.position.x + this.r * Math.cos(this.a * i), this.position.y + this.r * Math.sin(this.a * i));
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
    }
  }