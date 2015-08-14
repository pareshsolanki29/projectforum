var express = require("express");
var app = express();
var fs = require("fs");
var ejs = require("ejs");
var sqlite3= require('sqlite3').verbose();
var db = new sqlite3.Database('forums.db')

//middleware
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedBodyParser);
var methodOverride = require('method-override');
app.use(methodOverride('_method'));


//config
app.listen(3000, function() {
  console.log("I'm listening!");
});

app.get("/", function(req, res){
     db.all("SELECT * FROM topics", function(err, rows){
     	// console.log(rows);
	 	var indexHtml = fs.readFileSync("./index.html", "utf8");
     	var renderedIndex= ejs.render(indexHtml, {rows:rows})
     	res.send(renderedIndex);

	});
});

app.get("/newTopic", function(req, res){
	var yourForm = fs.readFileSync("./newTopic.html","utf8");
	res.send(yourForm)
});

// app.get("/yourTopic/:id", function(req, res){
// 	var newTopic= fs.readFileSync("./yourTopic.html", "utf8");
// 	res.send(newTopic);
// });

app.post("/yourTopic", function(req, res){
	// console.log(req.body);
	var username = req.body.username;
	var title = req.body.title;
	var post = req.body.post;
	db.run("INSERT INTO topics (username, title, post) VALUES(?, ?, ?)", req.body.username, req.body.title, req.body.post, function(err){
			res.redirect("/");
	
});
});
// app.post("/yourTopic/:id", function(req, res){
// 	db.get("SELECT * FROM topics INNER JOIN comments ON comments.topic_id = topics.id")
// 	db.run("INSERT INTO comments (comment, topic_id) VALUES	(?, ?, ?)" , req.body.comment, function(err){

// 	})
// })

app.get("/yourTopic/:id", function(req, res){
	    console.log(req.params.id);
	   	db.get("SELECT * FROM topics WHERE id=?", req.params.id , function(error,row) {
	   		console.log(row);
			var html = fs.readFileSync("./yourTopic.html", "utf8");
			var rendered = ejs.render(html, row);
			res.send(rendered);
	});
	   });


app.post("/yourTopic/:id", function(req, res){
	console.log(req.body);
    db.get("SELECT * FROM topics INNER JOIN comments ON   topics.id = comments.topics_id", function(error, row){
    	console.log(row);
    	db.run("INSERT INTO comments (comment, topic_id) VALUES (?, ?)", req.body.comment, row, function(err){
    		console.log(req.body);
    		res.redirect("/");
    })
});	
});


