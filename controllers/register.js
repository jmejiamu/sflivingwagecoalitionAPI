const jwt = require('jsonwebtoken');

//  days|hours|min| sec = 3 days in seconds
const maxAge = 45 * 60;
const createToken = (id) => {
    const payload = {
        user: id
    }

    return jwt.sign(payload, 'SECRET_SF', {
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
                        return res.status(200).json({ token })
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