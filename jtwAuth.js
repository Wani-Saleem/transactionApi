const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware = (req,res,next) => {
    const authorization = req.headers.authorization;

    if(!authorization) return res.status(400).json({message: "Tokenn invalid"});

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({
        error : "Unauthorized"
    })

    try{
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).json({
            message: err
        })
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_KEY, {expiresIn: 10000});
}

module.exports = {jwtAuthMiddleware, generateToken};