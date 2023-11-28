import Vector2D from "./vector2d.js";

import { randIntRange } from "./crutils.js";

export class Food{
    constructor(canvas){
      this.defaultSize=4;
      this.width=this.defaultSize;
      this.height=this.defaultSize;
      this.fillColor="hsl(0 100% 50%)";
      this.strokeColor="";
      this.canvas=canvas;
      this.context=this.canvas.getContext("2d");
      
      this.tags=["food"];//string array
      this.size=randIntRange(1,4);
      this.width=this.width*this.size;
      this.height=this.height*this.size;
      this.amount=1;
      this.position=new Vector2D(randIntRange(0+this.width,canvas.width-this.width),randIntRange(0+this.height,canvas.height-this.height));
    }
    eaten(){
      this.amount=1;
      this.size=randIntRange(1,4);
      this.position=new Vector2D(randIntRange(0+this.width,canvas.width-this.width),randIntRange(0+this.height,canvas.height-this.height));
    }
    eat(){
      if(this.amount>0) this.amount-=0.01;    
    }
    update(){    
      this.width=this.defaultSize*this.size*this.amount;
      this.height=this.defaultSize*this.size*this.amount;
    }
    draw(){
      this.context.save();
      this.context.translate(-this.width*0.5,-this.height*0.5);
      this.context.fillStyle=this.fillColor;//head of npc
      this.context.fillRect(this.position.x,this.position.y,this.width,this.height);   
      this.context.restore();
    }
  }