window.onload = function(){
  var SPEED = -1,tryspeed=0;

  var OBJETOS = prompt("Digite a quantidade de objetos no comôdo:");
  while(tryspeed==0){
    SPEED = prompt("VELOCIDADE ROBÔ:\n[1] - NORMAL\n[2] - RÁPIDO\n[3] - ULTRA RÁDIO" );
    if(SPEED == 1){SPEED = 150;tryspeed =1;}
    if(SPEED == 2){SPEED = 100;tryspeed =1;}
    if(SPEED == 3){SPEED = 40;tryspeed =1;} 
  }
  const sprites = new Image();
  sprites.src = "./bot-graphics.png";
  
  let box =32;  // tamanho dos quadrados
  const boxes = 16; // quantidade des quadrados na area

  const canvas = document.getElementById("luna");
    canvas.width  = 512;
    canvas.height = 512;
  const ctx = canvas.getContext("2d");  

  const bot = {x: 0, y: 0, direction: {x: 0, y: 1}};
  const lastLocalBot ={x:0, y:0}
  const lastDirection = {direction:{x:0,y:0}};
  const DEADLOCK_1={x:-1,y:0};
  const DEADLOCK_2={x:-2,y:0};
  const DEADLOCK_3={x:-3,y:0};
  const DEADLOCK_4={x:-4,y:0};
  const DEADLOCK_5={x:-5,y:0};
  var mov_Ant_Bot =[];
  const trail = [];
  var block = [];
  var map =[];
  var changeDirection=0;
  const delay = new Promise( botIA => setTimeout(botIA,1));  

  createRandonBlock();
  createMap();  
  
  const interval = setInterval(game, SPEED); //inicia  

  function game(){        
    update();  
    botIA();               
  }
      //direita  { x: 1, y: 0};
      //baixo    { x: 0, y: 1};     
      //esquerda { x: -1, y: 0}; 
      //cima     { x: 0, y: -1}; 

  function update(){
    //bot trail update
    trail.push({x: bot.x, y: bot.y, anchor: bot.direction});        
    //move bot
    bot.x += bot.direction.x;
    bot.y += bot.direction.y; 

    borderColision();
    blockCheck();
    trailCheck();
    render();
    logBot();  
  }

  function deadLock(){
    bot.y=mov_Ant_Bot.pop();
    bot.x=mov_Ant_Bot.pop();
     DEADLOCK_1={x:-1,y:0};
     DEADLOCK_2={x:-2,y:0};
     DEADLOCK_3={x:-3,y:0};
     DEADLOCK_4={x:-4,y:0};
     DEADLOCK_5={x:-5,y:0};
  }

  function botIA(){           
      if(bot.direction.x==0&&bot.direction.y==0)changeDirection++;
      if(changeDirection ==1){
        bot.direction = {x:0,y:1};
        DEADLOCK_1.x = lastLocalBot.x;
        DEADLOCK_1.y = lastLocalBot.y;
        update();
        delay =new Promise( botIA => setTimeout(botIA,1));          
      }
      if(changeDirection ==2){
        bot.direction = {x:1,y:0};
        DEADLOCK_2.x = lastLocalBot.x;
        DEADLOCK_2.y = lastLocalBot.y;
        update();
        delay =new Promise( botIA => setTimeout(botIA,1));  
      } 
      if(changeDirection ==3){
        bot.direction = {x:0,y:-1};
        DEADLOCK_3.x = lastLocalBot.x;
        DEADLOCK_3.y = lastLocalBot.y;
        update();
        delay =new Promise( botIA => setTimeout(botIA,1));  
      } 
      if(changeDirection ==4){
        bot.direction = {x:-1,y:0}
        DEADLOCK_4.x = lastLocalBot.x;
        DEADLOCK_4.y = lastLocalBot.y;
        update();
        delay =new Promise( botIA => setTimeout(botIA,1));  
      }
      if(changeDirection ==5){
        DEADLOCK_5.x = lastLocalBot.x;
        DEADLOCK_5.y = lastLocalBot.y;
        changeDirection=0;
      }
        
      if((DEADLOCK_1.x === DEADLOCK_2.x && DEADLOCK_1.y === DEADLOCK_2.y)&&(DEADLOCK_3.x === DEADLOCK_4.x && DEADLOCK_3.y === DEADLOCK_4.y)&&(DEADLOCK_1.x === DEADLOCK_4.x && DEADLOCK_1.y === DEADLOCK_4.y)&&(DEADLOCK_1.x === DEADLOCK_5.x && DEADLOCK_1.y === DEADLOCK_5.y)){
        deadLock();        
      }         
  }

  function logBot(){
    map[bot.y][bot.x] = 1;
    if(bot.direction.x!=0 || bot.direction.y !=0){
      lastDirection.x = bot.direction.x;
      lastDirection.y = bot.direction.y;       

      if(lastLocalBot.x !=bot.x || lastLocalBot.y != bot.y){
        lastLocalBot.x = bot.x;
        lastLocalBot.y = bot.y;
        mov_Ant_Bot.push(bot.x);
        mov_Ant_Bot.push(bot.y);        
      }   
    }    
  }

  function trailCheck(){
    if(map[bot.y][bot.x] == 1){     
      if(bot.direction.x == -1) bot.x -= bot.direction.x;
      if (bot.direction.x == 1) bot.x -= bot.direction.x; 
      if(bot.direction.y == -1) bot.y -= bot.direction.y;     
      if (bot.direction.y == 1) bot.y -= bot.direction.y;
      bot.direction = { x: 0, y: 0};       
    }
  }

  function borderColision(){
    if(bot.x < 0 )            {bot.direction = { x: 0, y: 0}; bot.x =0;}
    else if(bot.x > boxes - 1){bot.direction = { x: 0, y: 0}; bot.x = boxes-1;}
    else if(bot.y < 0)        {bot.direction = { x: 0, y: 0}; bot.y =0;}
    else if(bot.y > boxes - 1){bot.direction = { x: 0, y: 0}; bot.y =boxes-1;}
  }

  function blockCheck(){
    for(var i=0;i<OBJETOS;i++){
      if(bot.x === block[i].x && bot.y === block[i].y){
        map[bot.y][bot.x] = -1; 
        if(bot.direction.x == -1) bot.x -= bot.direction.x;
        if (bot.direction.x == 1) bot.x -= bot.direction.x; 
        if(bot.direction.y == -1) bot.y -= bot.direction.y;     
        if (bot.direction.y == 1) bot.y -= bot.direction.y;
        bot.direction = { x: 0, y: 0};        
      }
    }
  }

  function render(){
    //backgorund
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //block
    for(var i=0;i<OBJETOS;i++){
      ctx.drawImage(sprites, 0, 192, 64, 64, block[i].x * box, block[i].y * box, box, box);
    }
    drawBot();
    drawLane(); 
  }

  function drawBot(){
    let spritePath = {x:256, y:0}   
    ctx.drawImage(
      sprites, spritePath.x, spritePath.y, 64, 64,
      bot.x * box, bot.y * box, box, box);
  }

  function drawLane(){
    let spritePath = {x:0,y:128,} 
    for(i=1; i < trail.length ;i++) {
      let  haveRight = haveLeft = haveUp = haveDown = false; 
      const { x , y } = trail[i].anchor
      let {x:beforeX, y:beforeY} = trail[i-1].anchor 
      //inverte valores
      beforeX *= -1;
      beforeY *= -1;

      if(x > 0) haveRight = true;
      else if(x < 0) haveLeft = true;
      else if(y < 0) haveUp = true;
      else if(y > 0) haveDown = true;      

      if(beforeX < 0) haveLeft = true;
      else if(beforeX > 0 ) haveRight = true;
      else if(beforeY < 0) haveUp = true;
      else if(beforeY  > 0) haveDown = true; 

      if( haveLeft && haveRight) spritePath = { x:64,y:0 }; 
      else if( haveUp && haveDown) spritePath = { x:128,y:64 }; 
      else if( haveLeft && haveDown) spritePath = { x:128,y:0 };
      else if( haveLeft && haveUp) spritePath = { x:128,y:128 }; 
      else if( haveRight && haveDown) spritePath = { x:0,y:0 }; 
      else if( haveRight && haveUp) spritePath = { x:0,y:64 };     
      
      ctx.drawImage(
        sprites, spritePath.x, spritePath.y, 64, 64,
        trail[i].x * box, trail[i].y * box, box, box);
    } 
  }

  function createRandonBlock(){
    for(var ar=0;ar<OBJETOS;ar++){
      block[ar] = {x: Math.floor(Math.random() * 15 + 1), y: Math.floor(Math.random() * 15 + 1)};
    };
  }

  function createMap(){
    map = [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];  
  }
}