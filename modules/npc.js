import Vector2D from "./vector2d.js";

import { randIntRange, degToRad } from "./crutils.js";

export class NPC{
    constructor(canvas){ 
      this.canvas=canvas;
      this.width=32;
      this.height=32;
      this.position=new Vector2D(randIntRange(0,this.canvas.width-this.width),randIntRange(0,this.canvas.height-this.height));  
      this.angle=Math.random()*360;
      this.context=this.canvas.getContext("2d");
      this.velocity=1;
      this.rotateVelocity=4;
      this.fillColor="hsl(280 100% 50%)";
      this.debugColor="hsl(25 75% 50%)";
      this.center=new Vector2D(this.position.x+this.width/2,this.position.y+this.height/2);
      
      this.name="0";
      this.state="think";
      this.tags=["npc"];//string array
      this.defaultColor="hsl(280 100% 50%)";
      this.searchColor="hsl(75 100% 50%)";
      this.angryColor="hsl(0 100% 50%)";
      this.thinkColor="hsl(0 0% 50%)";
      this.eatingColor="hsl(150 100% 50%)";
      this.searchSkill=0.90;
      this.hunger=0.75;
      this.hungerRate=0.001;    
      this.curiosity=0.5;
      this.curiousRate=0.001;
      this.target=null;
      this.setTarget({position:new Vector2D(randIntRange(0,this.canvas.width-this.width),randIntRange(0,this.canvas.height-this.height))});//testing
      this.rotateTowards(this.target.position);
    }  
    setCanvas(c){
      this.canvas=c;
      this.context=this.canvas.getContext("2d");
    }
    getCenter(){
      this.center=new Vector2D(this.position.x+this.width/2,this.position.y+this.height/2);
      return this.center;
    }
    getCollision(){
      return {x:this.x,y:this.y,width:this.width,height:this.height};
    }
    setTarget(t){
      this.target=t;
      this.rotateTowards(this.target.position);
    }
    compareDistance(go){
      let x=Math.abs(this.position.x)-Math.abs(go.position.x);
      let y=Math.abs(this.position.y)-Math.abs(go.position.y);
      return x+y;
    }
    setTargetNearest(tag,goList){
      let nearest=null;
      goList.forEach((go)=>{
        if(go.tags.includes(tag)){//tagged object we want
          if(nearest===null) {
            nearest=go;
            return;
          }//if nearest not set, set to first go
          //compare go, nearest, and self, set closest one to nearest
          let currentDist=this.compareDistance(go);
          let nearestDist=this.compareDistance(nearest);
          if(currentDist<nearestDist){
            console.log(true);
            nearest=go;
          }else{
            console.log("true2");
            nearest=nearest;
          }
        }
      });
      this.setTarget(nearest);
    }
    moveToTarget(){
      if(this.position.x<this.target.position.x) this.position.x+=this.velocity;
      if(this.position.x>this.target.position.x) this.position.x-=this.velocity;
      if(this.position.y<this.target.position.y) this.position.y+=this.velocity;
      if(this.position.y>this.target.position.y) this.position.y-=this.velocity;    
    }
    targetReached(){
      //callback for overriding
      this.state="think"
    }
    rotateTowards(vector){//WORKING, edge not corner but from center
       let direction = Vector2D.difference(vector,this.position);
       direction=direction.normalize();
       var angle = Math.atan2(direction.y, direction.x) * (360 / (Math.PI * 2)); 
       var offset = 90; //float
       angle=Vector2D.up.x * (angle + offset) + Vector2D.up.y * (angle + offset);
       
       let difference=Math.floor(this.angle - angle), absDiff=Math.abs(difference);
       if(difference===0) return;//no difference
       if(absDiff<180){//if the absolute difference under 180
         if(this.angle<angle){//if less than, rotate forward
          this.angle = Math.floor(this.angle+this.rotateVelocity);
         }else{//if greater than, rotate backwards
          this.angle = Math.floor(this.angle-this.rotateVelocity);         
         }
      }else{//if the absolute difference over 180
         if(this.angle<angle){//if less than, rotate forward
          this.angle = Math.floor(this.angle-this.rotateVelocity);
         }else{//if greater than, rotate backwards
          this.angle = Math.floor(this.angle+this.rotateVelocity);         
         }      
      }
      this.angle = ((this.angle % 360) + 360) % 360;//correct for negative degrees
      if(this.angle-this.rotateVelocity===angle||this.angle+this.rotateVelocity===angle) this.angle=angle;//if within range of rotateVelocity, keep on target angle
    }
    normalizeProp(str){
          if(this[str]<0) this[str]=0.01;
          if(this[str]>1) this[str]=1;        
    }
    testOnTarget(){
      return this.position.x===this.target.position.x&&this.position.y===this.target.position.y;
    }
    clearTarget(){
      this.target=null;
      this.state="think";
    }
    update(dt){
      switch(this.state){
        case "searching":
          if(this.target===null) this.state="think"
          this.fillColor=this.searchColor;
          this.hunger+=this.hungerRate;
          this.normalizeProp("hunger");
          this.curiosity-=this.curiousRate;
          this.normalizeProp("curiosity");
          this.rotateTowards(this.target.position);
          this.moveToTarget();
          if(this.testOnTarget()) this.targetReached();
          break;
        case "think":
          this.fillColor=this.thinkColor;
          this.hunger+=this.hungerRate;
          this.normalizeProp("hunger");
          this.curiosity-=this.curiousRate;
          this.normalizeProp("curiosity");
          if(this.target){
              if(this.target.amount>0&&this.testOnTarget()){
                this.state="eating";
              }else{
                //this.setTarget({position:new Vector2D(randIntRange(0,this.canvas.width-this.width),randIntRange(0,this.canvas.height-this.height))});//testing
                this.target.eaten();
                this.state="searching";              
              }
          }
          break;
        case "eating":  
          if(this.target===null) this.state="think"      
          this.fillColor=this.eatingColor;
          if(this.target.amount<=0) {
            this.state="think";
          };        
          this.curiosity+=this.curiousRate*2;
          this.normalizeProp("curiosity");
          this.hunger-=this.hungerRate*2;
          this.normalizeProp("hunger");
          this.target.eat();
          break;
        default:
          if(this.target===null) this.state="think"
          this.fillColor=this.defaultColor;
          this.position.x+=this.velocity;
          this.position.y+=this.velocity;  
          break;
      }
      if(this.position.x>=this.canvas.width) this.position.x=0-this.width;
      if(this.position.y>=this.canvas.height) this.position.y=0-this.height;
      if(this.position.x<0) this.position.x=0+this.width;
      if(this.position.y<0) this.position.y=0+this.height;
    }
    draw(dt){    
      this.context.save();
      //this.context.translate(this.getCenter().x, this.getCenter().y);//this keeps position in upper left corner
      this.context.translate(this.position.x, this.position.y);//this shows rotation working properly but puts us dead center
      
      this.context.rotate(degToRad(this.angle));//requires radians
      this.context.translate(-this.getCenter().x, -this.getCenter().y+this.height/2);  //with position translate   
      //this.context.translate(-this.getCenter().x, -this.getCenter().y);
      
      this.context.fillStyle=this.fillColor;    
      this.context.fillRect(this.position.x,this.position.y,this.width,this.height); 
      
      this.context.font = '24px serif';
      this.context.fillStyle="black";
      this.context.fillText(this.name, this.position.x+this.width/2-(6*this.name.length),this.position.y+this.height/2+9);
      
      this.context.fillStyle=this.debugColor;//head of npc
      this.context.fillRect(this.position.x+this.width/2-2,this.position.y,4,4);  
      
      this.context.translate(0,-this.height/2);
      this.context.restore(); 
    }
  }