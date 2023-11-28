import Renderer2D from "./modules/renderer2d.js";
import { NPC } from "./modules/npc.js";
import { Food } from "./modules/food.js";

//import {  } from "./modules/crutils";

document.addEventListener("DOMContentLoaded", main);

function main() {
    let canvas=document.getElementById("canvas");
    let ctx=canvas.getContext("2d");
    let renderer=new Renderer2D();
    canvas.width=512;
    canvas.height=512;
    
    let npcCount=25;
    
    let gameObjects=[];
    let creatures=[];
    let food=[];
    
    for(let n=0;n<npcCount;n+=1){
      let tempCreature=new NPC(canvas);
      let tempFood=new Food(canvas);
      tempCreature.name=n+1+"";
      tempCreature.setTarget(tempFood);
      creatures.push(tempCreature);
      food.push(tempFood);
      gameObjects.push(tempCreature);
      gameObjects.push(tempFood);
    } 
    
    // creatures.forEach((c)=>{
    //   c.setTargetNearest("food",gameObjects);
    // });  
    
    creatures[0].target=null;
    document.addEventListener("click",()=>{
      if(creatures[0].target===null) creatures[0].target=food[0];
      else if(creatures[0].target) creatures[0].clearTarget();
    });
    
    renderer.update=(deltaTime)=>{
        // delta time available here as deltaTime
        // console.log(deltaTime)      
        ctx.fillStyle="white";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        creatures.forEach((c)=>{c.update()});
        food.forEach((f)=>{f.update()});
        
        ctx.save();
        ctx.font = '48px serif';
        ctx.fillStyle="black";
        ctx.fillText("1 state: ", 10, 50);
        ctx.fillStyle=creatures[0].fillColor;
        ctx.fillText(creatures[0].state, 150, 50);
        ctx.fillStyle="black";
        ctx.fillText(`hunger: ${creatures[0].hunger.toFixed(4)}`, 10, 100);
        ctx.fillText(`curiosity: ${creatures[0].curiosity.toFixed(4)}`, 10, 150);
        ctx.fillText(`angle: ${creatures[0].angle}`, 10, 200);
        ctx.restore();
      
        //last drawn is on top
        food.forEach((f)=>{f.draw()});
        creatures.forEach((c)=>{c.draw()});    
    };  
    renderer.startAnimation();
  }