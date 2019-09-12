const app = require('express')();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = 'qsdjS12ozehdoIJ123lfjlkdgjasdg221sfdg2113asdgf313fadf3ghduihqsDAqsdq';


let http = require('http').Server(app);
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json({ limit: '10mb', extended: true }));

app.get('/', urlencodedParser, (req, res) => {
  res.json({ success: true });
});

/* fonction de verification du token */
const checkUserToken = (req, res, next) => {
  if (!req.header('authorization')) {
    return res.status(401).json({
      success: false,
      message: 'Missing authentication header'
    });
  }
  const token = req.header('authorization').split(' ')[1];
  jwt.verify(token, secret);
  next();
};

/*connection a la base de donne */
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'base_tictac',
  password: 'root',
  port: 5432,
});
pool.connect()

const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'base_tictac',
  password: 'root',
  port: 5432,
})
client.connect()



pool.connect(function (err){
  console.log('connect ?');
  if (err){
    console.log('connect KO');
    console.log(err.stack);
  }
  else
    console.log('connected');
})


// function notre_funct(req, res) {
// return function notre_sous_funct(error, results) {
      // On fait ce dont on a besoin MAIS avec req & res.
//  }
// }
const mailCallback = (req, res) => (error, results) => {
    if (error) {
      throw error;
    }
    else {
      var myMail = 'init';
      if (results.rows[0])
          var myMail = results.rows[0].email;
      if (req.body.email == myMail) { // test sur donnee en dur et non pas sur donnees de la bdd
      const myToken = jwt.sign({
        iss: '',
        user: '',
        scope: 'user'
      }, secret);
      var myId = results.rows[0].id_user;
      var myDate = results.rows[0].date;
      var myNb = results.rows[0].nb_word;
      res.json({
        token: myToken,
        message: 'Successfully logged user',
        success: true,
      });
    } else {
        res.json({
        mail : req.body.email,
        message: 'email inexistant',
        success: false,
        });
        res.sendStatus(401);
      }
  }
};

/*selection des mails */
function getMail(req, res, var_mail){
 client.query('SELECT * FROM table_tictac WHERE email = $1',[var_mail], mailCallback(req, res));
}

/* se log et recuperer un token */
app.post('/api/token', urlencodedParser, (req, res) => {
  console.log('--------debut app.post api token-----------------');
  if (!req.body) {
    res.sendStatus(500);
  } else {
    var var_mail = req.body.email
    console.log('mail envoye par post : ' + var_mail);
    getMail(req, res, var_mail);
  }
});



/* recuperation du texte envoye */
app.post('/api/justify',urlencodedParser, checkUserToken, (req, res) => {
  if (!req.body) {
    res.sendStatus(500);
  } else {
    if (req.body.text_in) { 
      var myText = req.body.text_in;
      res.json({
        text_out: myText,
        message: 'justification-ok',
        success: true,
      });
    } else {
      res.sendStatus(401);
    }
  }
});





/*teste de communication avec un token*/
app.get('/api/secretFiles', urlencodedParser, checkUserToken, (req, res) => {
  res.json({message: 'Clement est amoureux'});
});




http.listen(8080, function () {
  console.log('listening on *:8080');
}); 


/* svg des differents tests de code

 // SQL Query > Select Data
  const query = client.query('SELECT * FROM table_tictac WHERE email = '+var_mail+';');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });

*/
