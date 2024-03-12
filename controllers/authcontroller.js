import bcrypt from 'bcrypt'
import  {generateJwt,} from '../configs/jwt.js'
import {createUser} from '../services/user.service.js'

const register = async(req,res)=>{
   try {
    const user = await createUser(req.body);
    const jwt = generateJwt(user.id);

    // await creatservciec.createuser(user)

    return res.status(200).send({jwt,message:"registed successfully"});
   } catch (error) {
      return res.status(500).send({error:error.message})
   }
}

const login =async(req,res)=>{
    try {
        const {password,email}= req.body;
        const user = await getUserByEmail(email);

        if(!user){
            return res.status(404).send({message:" user not found with Email given by You"});
        }
       const isPassword = await bcrypt.compare(password,user.password);

       if(!isPassword){
        return    res.status(404).send({message:" password not matched "});
       
       }
       
       const token = generateJwt(user.id);

       return res.status(200).send({token,message:"login successfully"});

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = {login,register}