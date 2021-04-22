const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();



//  days|hours|min| sec = 3 days in seconds
const maxAge = 45 * 60;
// const createToken = (id) => {
//     const payload = {
//         user: id
//     }

//     return jwt.sign(payload, 'SECRET_SF', {
//         expiresIn: maxAge,
//     })
// }
const idGenerator = () => {
    let randomString = "";
    let string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

    for(let i = 0; i < 21; i++){
        let randomIndex = Math.random() * (string.length - 1);
        randomString = randomString + string[Math.round(randomIndex)];
    }

    return randomString;
}

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    const confirmationId = idGenerator();
    
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }

    const salt = 10
    const hash = bcrypt.hashSync(password, salt);

    console.log("register handler,", hash, email, name, confirmationId);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email,
            confirmationId: confirmationId
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: email,
                        name: name,
                    })
                    .then(user => {
                        // const token = createToken(user[0])
                        // // res.cookie('jwt', token, { httpOnly: true, })
                        // // return res.json(user[0])
                        // return res.status(200).json({ token })
                        //set up transport of nodemailer.
                        const transport = nodemailer.createTransport({
                            service: "Gmail",
                            port: 465,
                            secure: true,
                            auth:{
                                user: process.env.Email,
                                pass: process.env.Password
                            }
                        });
                        
                        // transport.sendMail({
                        //     from: process.env.Email,
                        //     to: email,
                        //     subject: "Please comfirm your account for SF LIVING WAGE COALITION Admin",
                        //     html: `
                        //            <h1>Email Confirmation</h1>
                        //            <h2>Hello, ${name}</h2>
                        //            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                        //            <a href=http://localhost:3000/comfirm/${confirmationId}>Click here</a>`
                        // })
                        
                        // res.status(200).json({
                        //     message: "Register sucessfully! Please check your email for comfirmation."
                        // });
                        
                        // const get_user = db.select('Id').from('users').where({ Id: user[0]});
                        // console.log("user in register,", get_user);
                        //send to comfirm link to user's email
                    })
            })

            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('Unable to regiter'))
}

module.exports = {
    handleRegister
}