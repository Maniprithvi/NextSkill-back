import {getAllUsers,getUserProfileByToken} from '../services/user.service.js'

const getAllUser =async (req,res)=>{
   try {
    
    const users =  await getAllUsers();

    return res.status(200).send(users);
   } catch (error) {
    console.log({error:error.message})
    return res.status(500).send({error:error.message})
   }
}

const getUserProfile=async(req,res)=>{
  try {
     const jwt = req.headers.authorization?.split(' ')[1];

     if(!jwt){
        return res.status(404).send({error:"token not found"});

     }
     const user = await getUserProfileByToken(jwt)
     return res.status(200).send(user);



  } catch (error) {
    console.log({error:error.message})
  }
}

module.exports ={getAllUser,getUserProfile}