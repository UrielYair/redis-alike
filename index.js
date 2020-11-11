const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var fs = require('fs');
const grammarFilename = "redis-grammar.pegjs";
const grammar = fs.readFileSync(__dirname + '/grammar/' + grammarFilename, 'utf8');


app.use('/dist', express.static(__dirname + '/dist'));
app.use('/grammar', express.static(__dirname + '/grammar'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('myredis cli', { grammar: grammar});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})