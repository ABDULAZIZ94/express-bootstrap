var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
//add bootstrap


//stup moggodb conection
mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true, useUnifiedTopology: true});
var app = express();
var upload = multer();

//person schema
var personSchema = mongoose.Schema({
   name: String,
   age: Number,
   nationality: String
});

var Person = mongoose.model("Person", personSchema);

var things = require('./things.js');

//confugure ti use pug template engine
app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.get('/', function(req, res) {
	res.render('page1');
});
app.post('/form', (req, res) => {
	console.log(req.body);
	res.send("recieved your request!");
});

app.get('/person', function(req, res){
   res.render('person');
});

app.post('/person', (req, res) =>{
   var personInfo = req.body; //Get the parsed information
   console.log(req.body);
   //res.send("recieved your datas!");
   if(!personInfo.name || !personInfo.age || !personInfo.nationality){
      res.render('show_message', {
         message: "Sorry, you provided worng info", type: "error"});
   } else {
      var newPerson = new Person({
         name: personInfo.name,
         age: personInfo.age,
         nationality: personInfo.nationality
      });
		
      newPerson.save(function(err, Person){
         if(err)
            res.render('show_message', {message: "Database error", type: "error"});
         else
            res.render('show_message', {
               message: "New person added", type: "success", person: personInfo});
      });
   }
});


app.get('/findperson', (req, res) => {
	Person.find((err, result)=> {
		res.json(result);
	});
});

app.listen(3000);