// const express = require('express')
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');

// const coo = cookieParser()
// const app = express();

// app.use(cookieParser())

//          days|hours|min| sec = 3 days in seconds
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'SECRET_SF', {
        expiresIn: maxAge,
    })
}

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }
    const salt = 2
    const hash = bcrypt.hashSync(password, salt);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
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
                        const token = createToken(user[0])
                        // res.cookie('jwt', token, { httpOnly: true, })
                        // return res.json(user[0])
                        return res.json({ token })
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