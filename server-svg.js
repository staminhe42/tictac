const app = require('express')();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = 'qsdjS12ozehdoIJ123lfjlkdgjasdg221sfdg2113asdgf313fadf3ghduihqsDAqsdq';


const endPromise = text => text;

const myPromise = new Promise((resolve, reject) => {
  setTimeout(_ => {
    resolve(endPromise("Fin de notre promesse."));
  }, 3000);
})

const myFunc = async data => {
  try {
    const value = await myPromise;    
  } catch (e) {
    // the error.
  }
  console.log(value);
  console.log("J'ai fini.");
};

myFunc();




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



/*selection des mails */
function getMail(var_mail){
  console.log('-----deb fn getMail----');
  console.log('var_mail envoye en param : ' +var_mail);

 let return_query =  3;
 return_query = client.query(var_mail);

 console.log(return_query);
 console.log('return_query : ' );
 console.log(return_query);
 console.log('-----fin fn getMail----');
 return(return_query);

client.query('SELECT * FROM table_tictac WHERE email = $1',[var_mail],(error, results) => {
    if (error) {
      throw error;
    }
    else {
      console.log('select ok');
      console.log(results.rows);
      console.log(results.rows[0].id_user);
      return_query = results.rows[0].id_user;
      client.end();
      return(return_query);
    }
    client.query(var_mail)
        .then(results => {
            const rows = results.rows;
            rows.map(row => {
                console.log(`Read: ${JSON.stringify(row)}`);
            });
            process.exit();
        })
  });



}

   


 



/*function getMail(var_mail){
    const text = 'SELECT * FROM table_tictac WHERE email = $1'
    const value = [var_mail];

    client
        .query(text,value)
        .then(res => {
            const rows = res.rows;
            rows.map(row => {
                console.log(`Read: ${JSON.stringify(row)}`);
            });
            process.exit();
        })
        .catch(err => {
            console.log(err);
        });
}*/



/* il faut acceder a la bdd sur l'email */
/* voir la difference de porte de var et let */
let user = {email: 'sophie_taminh@yahoo.fr'}
var var_mail = '  ';


/* se log et recuperer un token */
app.post('/api/token', urlencodedParser, (req, res) => {
  console.log('--------debut app.post api token-----------------');
  if (!req.body) {
    res.sendStatus(500);
  } else {
    var var_mail = req.body.email
    console.log('mail envoye par post : ' + var_mail);
    var arr =[];
    arr = getMail(var_mail);
    console.log(arr);
    /*console.log(results.rows);*/
    if (req.body.email === user.email) { // test sur donnee en dur et non pas sur donnees de la bdd
      const myToken = jwt.sign({
        iss: '',
        user: '',
        scope: 'user'
      }, secret);
      res.json({
        token: myToken,
        message: 'Successfully logged user',
        success: true,
      });
    } else {
      res.sendStatus(401);
    }
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
