import Renderer2D from "./modules/renderer2d.js";
import {resizeCanvas} from "./modules/crutils.js";
import  Hexagon from "./modules/hexagon.js";

/*
* MODULES DO NOT WORK LOCALLY, MUST USE WEBSERVER TO TEST, VSCode: Ctrl+P > Live Server:Open with Live Server
*/

document.addEventListener("DOMContentLoaded",main);

function main(){
    let canvas=document.getElementById("canvas");
    let ctx=canvas.getContext("2d");
    let renderer=new Renderer2D();
    resizeCanvas(canvas);  
    
    //init
    renderer.update=(deltaTime)=>{
        // delta time available here as deltaTime
        // console.log(deltaTime)
        ctx.fillStyle="rgba(0,0,0,0.05)"; //if you want a grid left behind
        ctx.fillRect(0,0,canvas.width,canvas.height);
        //ctx.filter = 'contrast(1.4) sepia(1) drop-shadow(-9px 9px 3px #e81)';
        ctx.globalAlpha=0.5; //if you want a trail    
        hex.update(); 
        hex.draw();      
        ctx.globalAlpha=1; //if you want a trail     
    };   
    renderer.clearCanvas=()=>{
      ctx.fillStyle="rgba(0,0,0,1)";
      ctx.fillRect(0,0,canvas.width,canvas.height);
    };
    
    let hexOptions={radius:64,stroke:"#f8eb03",fill:"#5d0ead",strokeSize:2};//colors must be HEX for color picker to work
    let hex=new Hexagon(canvas,hexOptions);
    renderer.startAnimation();
    
    //dom stuff    
    let elementsList = document.querySelectorAll(`
      #fpsInput, 
      #fpsDisplay, 
      #strokeColor, 
      #fillColor, 
      #sizeInput, 
      #sizeDisplay,
      #strokeSizeInput,
      #strokeSizeDisplay,
      #startBut,
      #pauseBut,
      #stopBut,
      #restartBut
    `);
    let elementsArray = [...elementsList]; //es6 way to get multiple IDs
    for (let e of elementsArray){ window[e.id] = e; } //dynamic var, global variable from ID and set value of variable to element  
    
    strokeColor.value=hexOptions.stroke;
    fillColor.value=hexOptions.fill;
    strokeColor.addEventListener("change",(e)=>{
      hexOptions.stroke=e.target.value;
      renderer.cancelAnimation();
      hex=new Hexagon(canvas,hexOptions);
      renderer.startAnimation();
    });
    fillColor.addEventListener("change",(e)=>{
      hexOptions.fill=e.target.value;
      renderer.cancelAnimation();
      hex=new Hexagon(canvas,hexOptions);
      renderer.startAnimation();
    });
    
    sizeDisplay.innerText=hexOptions.radius;
    sizeInput.value=hexOptions.radius;
    sizeInput.addEventListener("input",(e)=>{   
      sizeDisplay.innerText=e.target.value;
    });
    sizeInput.addEventListener("change",(e)=>{  
      hexOptions.radius=parseInt(e.target.value,10); //unparsed will cause bugs   
      sizeDisplay.innerText=hexOptions.radius; 
      renderer.cancelAnimation();
      hex=new Hexagon(canvas,hexOptions);  
      renderer.startAnimation();
    });  
    
    strokeSizeDisplay.innerText=hexOptions.strokeSize;
    strokeSizeInput.value=hexOptions.strokeSize;
    strokeSizeInput.addEventListener("input",(e)=>{   
      strokeSizeDisplay.innerText=e.target.value;
    });
    strokeSizeInput.addEventListener("change",(e)=>{  
      hexOptions.strokeSize=parseInt(e.target.value,10); //unparsed will cause bugs   
      strokeSizeDisplay.innerText=hexOptions.strokeSize; 
      renderer.cancelAnimation();
      hex=new Hexagon(canvas,hexOptions);  
      renderer.startAnimation();
    });  
    
    fpsDisplay.innerText=renderer.fpsOptions.fps;
    fpsInput.value=renderer.fpsOptions.fps;
    fpsInput.addEventListener("input",(e)=>{   
      fpsDisplay.innerText=e.target.value;
    });
    fpsInput.addEventListener("change",(e)=>{    
      renderer.fpsOptions.fps=e.target.value;
      fpsDisplay.innerText=renderer.fpsOptions.fps;  
      renderer.cancelAnimation();
      hex=new Hexagon(canvas,hexOptions);  
      renderer.startAnimation();
    });
    
    startBut.addEventListener("click",(e)=>{
      e.preventDefault();
      //hex=new Hexagon(canvas,hexOptions);
      if(renderer.state==="stopped") renderer.startAnimation();    
    });  
    pauseBut.addEventListener("click",(e)=>{
      e.preventDefault();
      if(renderer.state==="playing"||renderer.updateStep) renderer.cancelAnimation();  
    });
    stopBut.addEventListener("click",(e)=>{
      e.preventDefault();
      renderer.clearCanvas();
      hex=new Hexagon(canvas,hexOptions);
      renderer.cancelAnimation();  
    });
    restartBut.addEventListener("click",(e)=>{
      e.preventDefault();
      renderer.cancelAnimation();
      hex=new Hexagon(canvas,hexOptions);
      renderer.startAnimation();    
    });    
    
    const PKEY=80;
    window.addEventListener("keydown",(e)=>{
      if (PKEY === e.keyCode) {
         document.getElementById("panel").classList.toggle("hide");
      }
    });
    window.addEventListener("resize",resizeCanvas.bind(this,canvas));
    window.addEventListener("resize",()=>{
      renderer.cancelAnimation();
      hex=new Hexagon(canvas,hexOptions);
      renderer.startAnimation();
    });
  }