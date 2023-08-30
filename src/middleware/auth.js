const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = (role) => async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        //for an api if any specific role is passed in the auth, then the token should have that role
        if (role && decoded.role !== role) {
            return res.status(403).json({ message: 'Access forbidden' });
        }
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        console.log('Auth completed')
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth