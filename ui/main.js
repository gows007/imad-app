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
  request.open('GET','http://localhost/counter',true);
  request.send(null);


  //Render the variable in the correct <span>
  counter = counter+1;

};

//Submit name

var submit = document.getElementById('submit_btn');
submit.onclick = function(){
  //Make a request to server and send the name
  var request = new XMLHttpRequest();
  //Capture the response and store it in a variable
  request.onreadystatechange = function(){
    if(request.readyState === XMLHttpRequest.DONE){
      //Take some action
      if(request.status === 200){ //request is sucessfull
        var names = request.responseText;
        names = JSON.parse(names);
        var list = '';
        for(var i=0; i<names.length; i++){
          list += '<li>' + names[i] + '</li>';
        }
        var ul = document.getElementById('nameList');
        ul.innerHTML = list;

      }
    }
  //Capture list of names and render it as a list
};
//request.open('GET','http://gows007.imad.hasura-app.io/submit-name?name='+name,true);
var nameInput = document.getElementById('name');
var name = nameInput.value;
request.open('GET','http://localhost/submit-name?name='+name,true);
request.send(null);

};

var submit_cmt = document.getElementById('submit_cmt');
submit_cmt.onclick = function(){
  //Make a request to server and send the name
  var request = new XMLHttpRequest();
  //Capture the response and store it in a variable
  request.onreadystatechange = function(){
    if(request.readyState === XMLHttpRequest.DONE){
      //Take some action
      if(request.status === 200){ //request is sucessfull
        var comments = request.responseText;
        comments = JSON.parse(comments);
        var comment_list = '';
        for(var i=0; i<comments.length; i++){
          comment_list += '<li>' + comments[i] + '</li>';
        }
        var ul = document.getElementById('commentList');
        ul.innerHTML = comment_list;

      }
    }
  //Capture list of comment and render it as a list
};

var commentInput = document.getElementById('comment');
var comment = commentInput.value;
var nameInput = document.getElementById('name');
var name = nameInput.value;
request.open('GET','http://localhost/submit-comment?comment='+comment+'&name='+name,true);
request.send(null);

};
