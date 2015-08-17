var express = require("express");
var app = express();
var fs = require("fs");
var ejs = require("ejs");
var sqlite3= require('sqlite3').verbose();
var db = new sqlite3.Database('forums.db');
app.use(express.static('public'));
 

//middleware
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedBodyParser);
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
var addon =1;


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



app.post("/yourTopic", function(req, res){
	// console.log(req.body);
	var username = req.body.username;
	var title = req.body.title;
	var post = req.body.post;
	db.run("INSERT INTO topics (username, title, post) VALUES(?, ?, ?)", req.body.username, req.body.title, req.body.post, function(err){
			res.redirect("/");
	
});
});


app.get("/yourTopic/:id", function(req, res){
   // console.log(req.params.id);
	var html = fs.readFileSync("./yourTopic.html", "utf8");
	   	db.get("SELECT * FROM topics WHERE id=?", req.params.id , function(error,row){
	   		// console.log(row);
     			db.all("SELECT * FROM  comments WHERE topics_id = ?", req.params.id ,function(err, rows){
				   console.log(rows);
					 db.all("SELECT * FROM likes where like_topic_id =?", req.params.id, function(err,rowss){

					// console.log(err);
					var rendered = ejs.render(html, { comments: rows, topic: row, likes:rowss });
					res.send(rendered);
					 })
     		})
	});
	   });

app.post("/yourTopic/:topics_id/likes", function(req, res){
	console.log("hey"+req.params.topics_id);
	  	db.run("INSERT INTO likes (counter, like_topic_id) VALUES (?, ?)", addon, req.params.topics_id, function(err, rows){
			console.log("the"+addon);
			res.redirect("/");
			addon++;
	});
});

app.post("/yourTopic/:topics_id/comments", function(req, res){
	// db.get("SELECT * FROM topics WHERE id=?", req.query.id, function(error, row){
 		console.log(req.params.topics_id);
			db.run("INSERT INTO comments (comment, topics_id) VALUES (?, ?)", req.body.comment, req.params.topics_id, function(err){
    			// console.log(req.body.comment);
    			res.redirect("/");
    
	})
	
});




