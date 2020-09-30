const jwt = require('jsonwebtoken')

const secret = 'SECRET_SF'
module.exports = async (req, res, next) => {

    const token = req.header("token");

    // Check if not token
    if (!token) {
        return res.status(403).json({ msg: "authorization denied" });
    }

    // Verify token
    try {
        //it is going to give use the user id (user:{id: user.id})
        const verify = jwt.verify(token, secret);

        req.user = verify.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
}