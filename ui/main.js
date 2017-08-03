console.log('Loaded!');

//Change the text of main-text div
var element = document.getElementById('main-text');

element.innerHTML = 'New Text';

//move image
var img = document.getElementById('madi');
img.onclick = function(){
  img.style.marginLeft = '100px';
}
