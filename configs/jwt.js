import jwt from 'jsonwebtoken'

const JWT = process.env.JWT_SECRET;

const generateJwt = (userId)=>{
    const token = jwt.sign({userId},JWT,{expiresIn:'48h'})
    return token
}

const getUserByToken = (token)=>{
    const decoded = jwt.decode(token,JWT);
    return decoded.userId
}

module.exports ={generateJwt, getUserByToken}