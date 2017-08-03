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
  request.open('GET','http://localhost/counter',true);
  request.open('GET','http://gows007.imad.hasura-app.io/counter',true);

  //Render the variable in the correct <span>
  counter = counter+1;

};
