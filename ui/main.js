console.log('Loaded!');


//Submit Username

var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    console.log('Submit button clicked');
  //Make a request to server and send the name
  var request = new XMLHttpRequest();
  //Capture the response and store it in a variable
  request.onreadystatechange = function(){
    if(request.readyState === XMLHttpRequest.DONE){
      //Take some action
      if(request.status === 200){ //request is sucessfull
        console.log('user logged in');
        alert('Logged in Sucessfull');
      }else{
          if(request.status === 403){
              alert('username/password is incorrect');
          }else{
              if(request.status === 500){
              alert('somewthing went wrong with server');
              }
          }
      }
    }
  //Capture list of names and render it as a list
};
//request.open('GET','http://gows007.imad.hasura-app.io/submit-name?name='+name,true);
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
console.log(username);
console.log(password);
request.open('POST','http://gows007.imad.hasura-app.io/login',true);
//request.open('POST','http://localhost/login',true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({username: username, password:password}));

};
