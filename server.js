const express = require('express');
const bodyParse = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
const dateformat = require('dateformat');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');

const addabout = require('./routes/post');
const updateEvents = require('./routes/update');
const deleteEvents = require('./routes/delete');
const register = require('./controllers/register');
const signin = require('./controllers/signin')

dotenv.config();

const db = knex({
    client: 'mysql',
    connection: {
        host: process.env.HOSTNAME,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
});




// db.select('*').from('about').then(data => {
//     console.log(data);
// });
const app = express();
// this does the same fucntion as body- parse
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.use(cors());
app.use(cookieParser());



app.get('/about', (req, res) => {
    db.select('*').from('about').then(data => {
        res.send(data);
    });

})
// app.post('/addabout', (req, res) => {
//     addabout.newPost(req, res, db);
// });

app.delete('/deleteEvent/:event_id', (req, res) => {
    deleteEvents.deleteEvent(req, res, db);
});

app.put('/updateEvent/:event_id', (req, res) => {
    updateEvents.updateEvent(req, res, db);
})

app.get('/ourcampaigns', (req, res) => {
    db.select('*').from('ourcampaigns').then(data => {
        res.send(data);
    });

})
app.get('/joinus', (req, res) => {
    db.select('*').from('joinf').then(data => {
        res.send(data);
    });

})

app.get('/even', (req, res) => {
    db.select('*').from('calendarevents').then(data => {
        res.send(data);
    });

})
app.get('/pictures', (req, res) => {
    db.select('*').from('pictures').then(data => {
        res.send(data);
    });
})
app.get('/arts', (req, res) => {
    db.select('*').from('art').then(data => {
        res.send(data);
    });
})
app.get('/calendar', (req, res) => {
    db.select('*').from('calendar').then(data => {
        res.send(data);
    });
})

app.get('/getinformed', (req, res) => {
    db.select('*').from('getinformed').then(data => {
        res.send(data);
    });
})

// - adding subscription
app.post('/subscription', (req, res) => {
    const { id, full_name, email, phone, notes } = req.body
    // console.log("id : ", id, 
    // " Full Name: ", full_name,
    // " E-Mail: ", email,
    // "  Phone: ", phone);
    db.insert
        ({
            id: id,
            full_name: full_name,
            email: email,
            phone: phone,
            notes: notes
        }).into('subscription')
        .then(data => {
            res.status(200).json({ insterted: "Insert DATA!" })
        })

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USEREMAIL,
            pass: process.env.USERPASSWORD
        }
    });

    let mailOptions = {
        from: process.env.USEREMAIL,
        to: process.env.USEREMAIL,

        subject: `Name: ${full_name}`,
        html: `<h1>User Information</h1>
              <h3>Name: ${full_name}</h3><br>
              <h3>E-mail: ${email}</h3><br>
              <h3>Phone: ${phone}</h3><br>
              <h3>Notes: ${notes}</h3>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(404).send(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Data was sent!!')
        }
    })


})

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt)
})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.listen(3001, () => {
    console.log('app is running at port 3001');
})

