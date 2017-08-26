var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

//For postgre
var Pool = require('pg').Pool;
var config={
  user: 'gows007',
  database : 'gows007',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var config_local={
  user: 'postgres',
  database : 'gows007',
  host: 'localhost',
  port: '5432',
  password: process.env.DB_PASSWORD
};
var pool = new Pool(config);


var app = express();
app.use(session({
    secret: 'randomSecretText',
    cookie: { maxAge: 1000*60*60*60*24*30}
}));
app.use(morgan('combined'));
app.use(bodyParser.json());

function createTemplate(data){
  var title = data.title;
  var heading = data.heading;
  var date = data.date;
  var content = data.content;
  var htmlTemplate = `
  <html>
    <head>
      <title>
        ${title}
      </title>
      <!-- To enable view in Mobile browser -->
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link href="/ui/style.css" rel="stylesheet" />
    </head>

    <body>
      <div class="container">
        <div>
          <a href="/">Home</a>
        </div>
        <hr/>
        <h3>
          ${heading}
        </h3>
        <div>
          ${date.toDateString()}
        </div>
        <div>
          ${content}
        </div>
      </div>
    </body>


  </html>

  `;
  return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt){
    //Crypto library in nodeJS
    var hashed = crypto.pbkdf2Sync(input,salt,1000,512,'sha512');
    //return hashed.toString('hex');
    return["pbkdf2Sync","10000",salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function (req, res){
    var salt = 'this-is-a-random-String';
    var hashedString = hash(req.params.input,salt);
    res.send(hashedString);
    
});

//post request, check notes
app.post('/create-user',function (req, res){
    
    //user-name, password
    //JSON request
    //{"username":"gows007", "password":"password"}
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password,salt);
    pool.query('INSERT INTO "user" (username,password)VALUES($1, $2)',[username, dbString],function(err,result) {
        if(err){
            console.log(err, res);
            res.status(500).send(err.toString());
        }else{
            console.log(pool);
            res.send('User sucessfully created: '+username);
        }

    });
    
});

app.post('/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result) {
        if(err){
            console.log(err, res);
            res.status(500).send(err.toString());
        }else{
               if(result.rows.length === 0){
                  res.status(403).send('username/password iss invalid');
              }else{
                  //Match password
                  var dbString = result.rows[0].password;
                  //get salt value and hash siince the passowrd in DB has the op as des in hash() function
                  var salt = dbString.split('$')[2];
                  var hashedPassword = hash(password,salt);
                  if(hashedPassword == dbString){
                      res.send('credentials correct!');
                      req.session.auth = {userId: result.rows[0].id};
                      
                      //Set a session available as a lib ans use cookies
                      
                  }else{
                     res.status(403).send('username/password iss invalid'); 
                  }
              }
            res.send('User sucessfully created: '+username);
        }

    });
    
    
});

app.get('/check-login',function(req,res){
     if(req.session.auth){
         res.send('session Available');
     }else{
       if(req.session && req.session.auth && req.session.auth.userId){
           res.send('You are logged in: '+req.session.auth.userId.toString());
       } 
       else{
           res.send('You are not logged in');
       }
     }
});

app.get('/test-db',function(req,res){
    //make a select request
    //return a resonse with results
  pool.query('SELECT * FROM test', function(err, result){
    if(err){
      console.log(err, res);
      res.status(500).send(err.toString());
    }else{
      console.log(pool);
      res.send(JSON.stringify(result.rows));
    }
});
});


var counter = 0;
app.get('/counter', function(req, res){
  counter = counter+1;
  //Only striing send as response, hence the conversion to string
  res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req, res){ //URL: /submit-name?name-xxxx
  //Get the name from request
  var name = req.query.name;
  names.push(name);
  //Only a String can be sent, not a variable
  //Use JSON
  res.send(JSON.stringify(names));

});

var comments = [];
var names = [];
app.get('/submit-comment', function(req, res){ //URL: /submit-name?name-xxxx
  //Get the name from request
  var comment = req.query.comment;
  var name = req.query.name;
  comment = comment + '<br />'+name+'<br />';
  comments.push(comment);
  //names.push(name);
  //Only a String can be sent, not a variable
  //Use JSON
  res.send(JSON.stringify(comments));

});


app.get('/article/:articleName',function (req, res) {
  //articleName == article-one
  //articles[articleName] = {} content object for article one
  //var articleName = req.params.articleName;
  pool.query("SELECT * FROM article WHERE title=$1",[req.params.articleName], function(err, result){
    if(err){
      console.log(err, res);
      res.status(500).send(err.toString());
    }else{
      if(result.rows.length === 0){
          res.status(404).send('article not found');
      }else{
          var articleData = result.rows[0]; 
          res.send(createTemplate(articleData));
      }
    }
});

});

/*
app.get('/article-one',function (req, res) {
  res.send(createTemplate(articleOne));
});

app.get('/article-two',function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));

});

app.get('/article-three',function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));

});
*/


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
