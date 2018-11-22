var express = require('express');
var app = express();
const port = 5566;
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(cors({
	origin: 'http://localhost:5555'
}));

/*Body parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));

/*Database connection - MongoDB*/

//Created from the command earlier. Ensure this is done on the first_db instance
var username = 'admin';
var password = '123456';

var dbHost = 'localhost';
var dbPort = '27017';
var database = 'first_db';

var url = 'mongodb://' + username + ':' + password + '@' + dbHost + ':' + dbPort + '/' + database;
console.log('mongodb connection = ' + url);

mongoose.connect(url, { useNewUrlParser: true }, function(err) {
    if(err) {
        console.log('connection error: ', err);
    } else {
        console.log('connection successful');
    }
});

/***********
Declare all models here
***********/

//User model
var ItemSchema = new mongoose.Schema({
     item: String,
     dateAdded: { type: Date, default: Date.now }
});

var Items = mongoose.model('items', ItemSchema);

//The API codes

//Display a default message
app.get('/', function (req, res) {
  res.send('This is the API server!');
})

//Get list of items
app.get('/items', function (req, res) {
  Items.find(function(err, items) {
      if(err) {
          console.log(err);
          res.json({ message : err });
      } else {
        return res.json(items);
      }
  });
});

//Add an item
app.post('/add', function (req, res) {

  if(req.body.item) {
    Items.create(req.body, function(err, data) {
        if(err) {
            console.log(err);
            res.json({ message : err });
        } else {
          res.json({
              message : req.body.item + ' successfully added!',
              data: data
          });
        }
    });
  } else {
    res.json({ message : 'Kindly enter an item.'});
  }

});

//Removing an item
app.delete('/delete', function (req, res) {

  if(req.body._id) {
    Items.findOneAndRemove({ _id: req.body._id }, function(err, data) {
        if(err) {
            console.log(err);
            res.json({ message : err });
        } else {
            res.json({
              message : data.item + ' successfully deleted!',
            });
        }
    });
  } else {
    res.json({ message : 'Row not found.'});
  }

});


//Run the server
app.listen(port, function() {
	console.log(`API server running on port ${port}`);
});