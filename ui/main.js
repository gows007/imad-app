console.log('Loaded!');

//Change the text of main-text div
var element = document.getElementById('main-text');

element.innerHTML = 'New Text';

//move image
var img = document.getElementById('madi');
var marginLeft = 0;
function moveRight(){
  marginLeft = marginLeft + 2;
  if(marginLeft > 400){
    marginLeft = 0;
  }
  img.style.marginLeft = marginLeft + 'px';
}

img.onclick = function(){
  //Apply moveRight function every 100 ms
  var interval = setInterval(moveRight, 50);
};
