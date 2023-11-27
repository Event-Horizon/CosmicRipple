/*
* General
*/
export function resizeCanvas(canvas,update){
    canvas.width=document.documentElement.clientWidth;
    canvas.height=document.documentElement.clientHeight;
}

export function randIntRange(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
export function randFloatRange(min, max){
    return Math.random() * (max - min) + min
}

export function degToRad(deg){
    return (deg*Math.PI)/180;
}

export function rotateVector(vector,angle){
    let theta = degToRad(angle);
  
    let cs = Math.cos(theta);
    let sn = Math.sin(theta);
    
    let x,y;
    x = vector.x * cs - vector.y * sn;
    y = vector.x * sn + vector.y * cs;
    return {x:x,y:y};
}

/*
* Async section
*/
export function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}