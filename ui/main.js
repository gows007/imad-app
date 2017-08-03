console.log('Loaded!');


var button = document.getElementById('counter');
var counter = 0;
button.onclick = function(){
  //Create a request to counter endpoint
  var request = new XMLHttpRequest();

  //Capture the response and store it in a variable
  request.onreadystatechange = function(){
    if(request.readyState === XMLHttpRequest.DONE){
      //Take some action
      if(request.status === 200){ //request is sucessfull
        var counter = request.responseText;
        var span = document.getElementById('count');
        span.innerHTML = counter.toString();
      }
    }
    //Not done then do nothing
  };

  //Make a request
  //request.open('GET','http://gows007.imad.hasura-app.io/counter',true);
  request.send(null);
  request.send(null);

  //Render the variable in the correct <span>
  counter = counter+1;

};

//Submit name
var nameInput = document.getElementById('name');
var name = nameInput.value;
var submit = document.getElementById('submit_btn');
submit.onclick = function(){
  //Make a request to server and send the name

  //Capture list of names and render it as a list
  var names = ['name 1','name 2','name 3'];
  var list = '';
  for(var i=0; i<names.length; i++){
    list += '<li>' + names[i] + '</li>';
  }
  var ul = document.getElementById('nameList');
  ul.innerHTML = list;
};
