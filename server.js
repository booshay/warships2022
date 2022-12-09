//Install express server
const express = require('express');
const path = require('path');
var https = require("https");

const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/relics'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname,'/dist/relics/index.html'));
});

/*setInterval(function() {
  let res =  https.get("https://warshipcoords.herokuapp.com/login");
    console.log(res);
}, 1500000); */ // refresh every 25 minutes (1500000)

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
