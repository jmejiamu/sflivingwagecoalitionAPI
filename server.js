const express = require('express');
const bodyParse = require('body-parser');
const knex = require('knex');
const cors = require('cors');

const db = knex({
    client: 'mysql',
    connection: {
      host : 'xxx.xxx.x.xx', // localhost or IP
      user : 'root',
      password : 'xxxxx', 
      database : 'sflivingwage'
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
app.get('/joinus', (req, res)=>{
    db.select('*').from('joinf').then(data => {
        res.send(data);
    });

})

app.get('/events', (req, res)=>{
    db.select('*').from('calendarevents').then(data => {
        res.send(data);
    });

})
app.listen(3001,()=>{
    console.log('app is running at port 3001');
})

