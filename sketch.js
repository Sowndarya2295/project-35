var database,dog,dogSad,dogHappy, foodS,foodStock,foodObj,fedTime,lastFed,feed,addFood;

function preload(){
dogSad=loadImage("Images/dogImg1.png");
dogHappy=loadImage("Images/dogHappy.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(dogSad);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(750,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(850,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background('Images/bgImage.png');
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//read foodStock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


// update food stock
function feedDog(){
  dog.addImage(dogHappy);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}