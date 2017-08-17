var express = require('express');
var morgan = require('morgan');
var path = require('path');

//For postgre
var Pool = require('pg');
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

var app = express();
app.use(morgan('combined'));


var articles ={
  'article-one': {
    title: 'Article One | Gowrishankar',
    heading: 'Article-one',
    date: 'Aug 2, 2017',
    content:    `
            <p>
              This is the first content of Article.In the search bar type in the name of the package you are looking to download. I don’t like installing package this way because you ending have a list of packages that you are not really looking for.  I like going through the command line to install packages.
            </p>
            <p>
              Whether you’re in high school or college, you spend a lot of time taking notess. You have several excellent options for doing so, and which works best for you depends a lot on your note taking style. It’s best to pick software and stick to it so you don’t to worry about moving stuff around later. Here’s how to make the right choice from the outset.
            </p>
            <p>
              Standing 1 ft 4 in  tall, Pikachu were the first "Electric-type" Pokémon created, their design intended to revolve around the concept of electricity.[9] They appear as Pika-like creatures that have short, yellow fur with brown markings covering their backs and parts of their lightning bolt shaped tails. They have black-tipped, pointed ears and red circular pouches on their cheeks, which can spark with electricity.[10] In Pokémon Diamond and Pearl, gender differences were introduced; a female Pikachu now has an indent at the end of its tail, giving it a heart-shaped appearance. They attack primarily by projecting electricity from their bodies at their targets. Within the context of the franchise, a Pikachu can transform, or "evolve" into a Raichu when exposed to a "Thunderstone". In later titles an evolutionary predecessor was introduced named "Pichu", which evolves into a Pikachu after establishing a close friendship with its trainer.
            </p>`
  },
  'article-two': {
    title: 'Article Two | Gowrishankar',
    heading: 'Article-Two',
    date: 'Aug 23, 2017',
    content:    `
            <p>
              This is the first content of Article.In the search bar type in the name of the package you are looking to download. I don’t like installing package this way because you ending have a list of packages that you are not really looking for.  I like going through the command line to install packages.
            </p>
            <p>
              Standing 1 ft 4 in  tall, Pikachu were the first "Electric-type" Pokémon created, their design intended to revolve around the concept of electricity.[9] They appear as Pika-like creatures that have short, yellow fur with brown markings covering their backs and parts of their lightning bolt shaped tails. They have black-tipped, pointed ears and red circular pouches on their cheeks, which can spark with electricity.[10] In Pokémon Diamond and Pearl, gender differences were introduced; a female Pikachu now has an indent at the end of its tail, giving it a heart-shaped appearance. They attack primarily by projecting electricity from their bodies at their targets. Within the context of the franchise, a Pikachu can transform, or "evolve" into a Raichu when exposed to a "Thunderstone". In later titles an evolutionary predecessor was introduced named "Pichu", which evolves into a Pikachu after establishing a close friendship with its trainer.
            </p>`

  },
  'article-three': {
    title: 'Article Three | Gowrishankar',
    heading: 'Article-Three',
    date: 'Mar 2, 2017',
    content:    `
            <p>
              This is the first content of Article.In the search bar type in the name of the package you are looking to download. I don’t like installing package this way because you ending have a list of packages that you are not really looking for.  I like going through the command line to install packages.
            </p>
            <p>
              Whether you’re in high school or college, you spend a lot of time taking notess. You have several excellent options for doing so, and which works best for you depends a lot on your note taking style. It’s best to pick software and stick to it so you don’t to worry about moving stuff around later. Here’s how to make the right choice from the outset.
            </p>`

  }
}

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
          ${date}
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

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    //make a select request
    //return a resonse with results
  pool.query('SELECT * FROM test', function(err, res){
    if(err){
      console.log(err, res);
      res.status(500).send(err.toString());
    }else{
      res.send(JSON.stringify(result));
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


app.get('/:articleName',function (req, res) {
  //articleName == article-one
  //articles[articleName] = {} content object for article one
  var articleName = req.params.articleName;
  res.send(createTemplate(articles[articleName]));
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
