const express = require('express');
const bodyParse = require('body-parser');
const knex = require('knex');
const cors = require('cors');

const db = knex({ 
    client: 'pg',
    connection: {
      connectString : process.env.DATABASE_URL,
      ssl: true
    }
  });
db.select('*').from('ourcampaigns').then(data => {
    console.log(data);
}); 

const app = express();
// this does the same fucntion as body- parse
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(bodyParse.json());
app.use(cors());
app.get('/about', (req, res)=>{
    db.select('*').from('about').then(data => {
        res.send(data);
    });
    
})
app.get('/ourcampaigns', (req, res)=>{
    db.select('*').from('ourcampaigns').then(data => {
        res.send(data);
    });
    
})

app.listen(process.env.PORT || 3000,()=>{
    console.log('app is running at port `${proccess.env.PORT}`');
})
/** 
 * / --> res = this is working
 *  /signin  --->POST = success/fail
 *  /register --> POST = user
 *  /profile/:userId --> GET = user 
 *  /image --> PUT -->  user
 * 
*/
