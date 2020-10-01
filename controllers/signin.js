const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    const payload = {
        user: id
    }
    return jwt.sign(payload, 'SECRET_SF', { expiresIn: maxAge, })
}

const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        const token = createToken(user[0])
                        // res.json(user[0])
                        res.json({ token, user: user[0] })
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(401).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Unable to get user'))
}

module.exports = {
    handleSignin
}