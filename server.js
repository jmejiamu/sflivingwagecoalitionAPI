const express = require('express');
const bodyParse = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
const dateformat = require('dateformat');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// const http = require("http");
// const path = require("path");
// const fs = require("fs");

const validinfo = require('./middleware/validinfo');
const authorization = require('./middleware/authorization');

const addabout = require('./routes/post');
const updateEvents = require('./routes/update');
const deleteEvents = require('./routes/delete');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const deleteArt = require('./routes/delete');
const deleteAssistance = require('./routes/delete');
dotenv.config();

//const mdb = require('knex-mariadb');
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

//multer module, a middleware, handle multipart file request datas.
var multer = require('multer');

// Set the destination and filename
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/xampp/htdocs/img/') //replace the path here 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

//intaniate the multer and set up the folder which store the image.
var upload = multer({ storage: storage });


//handle add art picture request
app.post('/addart', upload.single('photo'), (req, res) => {

    const { title, description, minimunbid } = req.body;
    if (!title || !description || !req.file) {
        return res.status(400).json('Expected format: { title: <String>, description: <String> , photo: <String>}. ')
    }

    // console.log(req.file);
    var path = 'http://157.245.184.202/images/Art/' + req.file.originalname
    //console.log( path)
    db.insert
        ({
            title: title,
            path: path,
            details: '',
            contact: description,
            name: '',
            bid: minimunbid,
            phone_email: ''
        }).into('art')
        .then(data => {
            res.status(200).json({ insterted: " DATA Inserted!" })
        })
        .catch(err => res.status(400).json('Unable to add new art work'))
})

app.put('/updateCloseDate', async (req, res) => {
    try {
        // var category =  req.category
        // const { art_id } = req.params;
        const {
            closeDate,
            category,
        } = req.body;

        const updateData = await db(category).update({
            closeDate: closeDate,
        })
        res.status(200).send({ data: "Update data" })
    } catch (error) {
        console.error(error.message);
    }
})

//handle insert details request
app.post('/addetail', upload.single('photo'), (req, res) => {
    const { long_description } = req.body;
    if (!long_description || !req.file) {
        return res.status(400).json('Expected format: { long_description: <String> , photo: <String>}. ')
    }
    var path = 'http://157.245.184.202/images/Art/' + req.file.originalname
    db.insert
        ({

            long_description: long_description,
            author_image: path

        }).into('details')
        .then(data => {
            res.status(200).json({ insterted: " DATA Inserted!" })
        })
        .catch(err => res.status(400).json('Unable to add new art work'))
})


app.get('/about', (req, res) => {
    db.select('*').from('about').then(data => {
        res.send(data);
    });

})

app.get('/salesdetail', (req, res) => {
    db.select('*').from('details').then(data => {
        res.send(data);
    })
})

app.put('/updateart/:art_id', upload.single('photo'), async (req, res) => {
    try {
        var path = 'http://157.245.184.202/images/Art/' + req.file.originalname
        const { art_id } = req.params;
        const {
            title,
            details,
            contact,
        } = req.body;

        const updateData = await db('art').update({
            title: title,
            path: path,
            details: details,
            contact: contact,
        }).where({ id: art_id })
        res.status(200).send({ data: "Update data" })
    } catch (error) {
        console.error(error.message);
    }
})


// app.post('/addabout', (req, res) => {
//     addabout.newPost(req, res, db);
// });

app.delete('/deleteEvent/:event_id', (req, res) => {
    deleteEvents.deleteEvent(req, res, db);
});

app.delete('/deleteart/:art_id', (req, res) => {
    deleteArt.deleteArt(req, res, db);
})

app.delete('/deleteassistance/:assis_id', (req, res) => {
    deleteAssistance.deleteAssistance(req, res, db)
})

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

})

app.post('/booksbid', (req, res) => {


    const { id, bid, name, phoneEmail, title } = req.body;
    db.transaction(trx => {
        trx.where({ id: id })
            .update({
                name: name,
                bid: bid,
                phone_email: phoneEmail
            })
            .into('pictures')
            .returning('name')
            .then(useData => {
                return trx('allbids')
                    .returning('*')
                    .insert({
                        title: title,
                        name: name,
                        bid: bid,
                        phone_email: phoneEmail
                    })
                    .then(d => {
                        return res.status(200).json({ data: "inserted" })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)

    })
        .catch(err => res.status(400).json({ data: "ERROR" }))

})

app.post('/artsbid', (req, res) => {

    db.transaction(trx => {
        trx.where({ id: req.body.id })
            .update({
                name: req.body.name,
                lastbid: req.body.bid,
                phone_email: req.body.phoneEmail
            })
            .into('art')
            .returning('name')
            .then(userData => {
                return trx('allbids')
                    .returning('*')
                    .insert({
                        title: req.body.title,
                        name: req.body.name,
                        bid: req.body.bid,
                        phone_email: req.body.phone_email
                    })
                    .then(d => {
                        return res.status(200).json({ data: "inserted" })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json({ data: 'ERROR' }))

})

app.post('/cdsbid', (req, res) => {

    const { id, bid, name, phoneEmail, title } = req.body;
    db.transaction(trx => {
        trx.where({ id: id })
            .update({
                name: name,
                bid: bid,
                phone_email: phoneEmail
            })
            .into('cds')
            .returning('name')
            .then(useData => {
                return trx('allbids')
                    .returning('*')
                    .insert({
                        title: title,
                        name: name,
                        bid: bid,
                        phone_email: phoneEmail
                    })
                    .then(d => {
                        return res.status(200).json({ data: "inserted" })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)

    })
        .catch(err => res.status(400).json({ data: "ERROR" }))
})

app.post('/dvdsbid', (req, res) => {

    const { id, bid, name, phoneEmail, title } = req.body;
    db.transaction(trx => {
        trx.where({ id: id })
            .update({
                name: name,
                bid: bid,
                phone_email: phoneEmail
            })
            .into('dvds')
            .returning('name')
            .then(useData => {
                return trx('allbids')
                    .returning('*')
                    .insert({
                        title: title,
                        name: name,
                        bid: bid,
                        phone_email: phoneEmail
                    })
                    .then(d => {
                        return res.status(200).json({ data: "inserted" })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)

    })
        .catch(err => res.status(400).json({ data: "ERROR" }))
})

app.post('/photosbid', (req, res) => {


    const { id, bid, name, phoneEmail, title } = req.body;
    db.transaction(trx => {
        trx.where({ id: id })
            .update({
                name: name,
                bid: bid,
                phone_email: phoneEmail
            })
            .into('photos')
            .returning('name')
            .then(useData => {
                return trx('allbids')
                    .returning('*')
                    .insert({
                        title: title,
                        name: name,
                        bid: bid,
                        phone_email: phoneEmail
                    })
                    .then(d => {
                        return res.status(200).json({ data: "inserted" })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)

    })
        .catch(err => res.status(400).json({ data: "ERROR" }))
})



app.post('/register', validinfo, async (req, res,) => {
    const { email, } = req.body;
    try {
        console.log("outside,", email);
        const userExist = await db.select('email').from('login').where({ email: email })
        console.log("userExist,", userExist);
        if (userExist.length > 0) {
            return res.json("user already exist")
        }
        register.handleRegister(req, res, db, bcrypt);
    } catch (error) {
        console.error(error.message);
        res.status(400).json("error")
    }


})

app.post('/signin', validinfo, async (req, res) =>{
    const {email} = req.body;
    try{
        const status = await db.select('status').from('users').where({email: email});

        console.log("status,",status);

        if(status.length === 0){
            return res.status(400).json("The user is not exist!")
        }
    
        if(status[0].status === "pending"){
            return res.status(400).json("Please verify your account in your email first!");
        }
        
        signin.handleSignin(req, res, db, bcrypt);

   }catch(err){
       res.status(400).json("error!");
   }
}
)

// app.post('/signin', validinfo, signin.handleSignin(db, bcrypt))

app.get("/isverify", authorization, (req, res) => {
    try {
        res.json(true)
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error")
    }
})

// this will get the user info it is a private route
app.get('/dashboard', authorization, async (req, res) => {
    try {
        // res.json(req.user)
        const user = await db.select('name').from('users').where({ id: req.user })
        res.json(user[0])
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server Error')
    }
})

app.get('/verifyEmail/:confirmationId', async (req, res) =>{
    const confirmationId = req.params.confirmationId;
    
    console.log('verify,',confirmationId);
    
    try{
        const userExist = await db.select('email').from('login').where({confirmationId: confirmationId});

        console.log('try,',userExist);

        if(userExist.length===0){
            return res.json({err: "The user is not exist!"});
        }
       
        console.log("payload,", userExist[0].email);

        const updateStatus = await db('users').update({status: 'active'}).where({email: userExist[0].email});
        const deleteConfirmationId = await db('login').update({confirmationId: null}).where({email: userExist[0].email});
        
        // const payload = {
        //     user: userExist[0].Id
        // }

        // console.log("payload,", payload);

        // const token = jwt.sign(payload, process.env.JWT_TOKEN, {expiresIn: 45 * 60});

        res.json({msg: "User verification sucess!"});
    }catch(err){
        return res.json({err: err.message});
    }
});


app.listen(3001, () => {
    console.log('app is running at port 3001');
})

