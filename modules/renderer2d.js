export default class Renderer2D{
    constructor(targetFPS){
      this.updateStep=null;
      this.state="stopped";
      this.fpsOptions={fps:targetFPS||30,fpsInterval:null,startTime:null,now:null,then:null,elapsed:null};    
      this.animTimer=-1;
      this.lastAnimTimer=-1;
      this.deltaTime=0;
    }
    cancelAnimation(){
      cancelAnimationFrame(this.updateStep);
      this.state="stopped";
    }
    startAnimation(){
      this.updateStep=requestAnimationFrame(this.init.bind(this,this.fpsOptions.fps)); 
    }
    init(fps,time){
      this.animTimer=0;
      this.lastAnimTimer=time;
      this.fpsOptions.fpsInterval=1000/this.fpsOptions.fps;
      this.fpsOptions.then=Date.now();
      this.fpsOptions.startTime=this.fpsOptions.then;
      this.state="playing";
      this.updateStep=requestAnimationFrame(this.drawNextFrame.bind(this));    
    }
    drawNextFrame(time){
      this.updateStep=requestAnimationFrame(this.drawNextFrame.bind(this));
      this.fpsOptions.now = Date.now();
      this.fpsOptions.elapsed = this.fpsOptions.now - this.fpsOptions.then; 
      this.deltaTime=time-this.lastAnimTimer;
      this.lastAnimTimer=time;
      this.animTimer+=this.deltaTime;   
      if(this.fpsOptions.elapsed>this.fpsOptions.fpsInterval){
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        this.fpsOptions.then = this.fpsOptions.now - (this.fpsOptions.elapsed % this.fpsOptions.fpsInterval);     
        if(this.update){
          this.update.call(this,this.deltaTime);
        }
      }    
    }
  }