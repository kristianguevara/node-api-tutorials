var express = require('express');
var app = express();
const port = 5555;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.listen(port, function() {
	console.log(`Server running on port ${port}`);
});