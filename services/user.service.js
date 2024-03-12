import jwt from'jsonwebtoken'
import bcrypt from 'bcrypt'
import jwtProvider  from "../config/jwt.js"
import Prisma from '../prisma/index.js';

const createUser = async (userData)=>{
    try {

        let {firstName,lastName,email,password,role}=userData;

        const isUserExist=await Prisma.user.findUnique({
            where:{
                email
            }
        })

        if(isUserExist){
            throw new Error("user already exist with email : ",email)
        }

        password=await bcrypt.hash(password,8);
    
        const user=await Prisma.user.create({
            data:{
                firstName,
                lastName,
                role,
                email,
                password
            }
        })

        console.log("user ",user)
    
        return user;
        
    } catch (error) {
        console.log("error - ",error.message)
        throw new Error(error.message)
    }

}

const findUserById=async(userId)=>{
    try {
        const user = await Prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user){
            throw new Error("user not found with id : ",userId)
        }
        return user;
    } catch (error) {
        console.log("error :------- ",error.message)
        throw new Error(error.message)
    }
}

const getUserByEmail=async(email)=>{
    try {

        const user=await Prisma.user.findUnique({
            where:{
                email
            }
        });

        if(!user){
            throw new Error("user found with email : ",email)
        }

        return user;
        
    } catch (error) {
        console.log("error - ",error.message)
        throw new Error(error.message)
    }
}


const getUserProfileByToken=async(token)=>{
    try {

        const userId=jwtProvider.getUserIdFromToken(token)

        console.log("userr id ",userId)
       
        const user = await Prisma.user.findUnique({
            where:{
                id:userId
            },
            include:{
                addresses
            }

        })
        user.password=null;
        
        if(!user){
            throw new Error("user not exist with id : ",userId)
        }
        return user;
    } catch (error) {
        console.log("error ----- ",error.message)
        throw new Error(error.message)
    }
}

const getAllUsers=async()=>{
    try {
        const users=await Prisma.user.findMany({})
        return users;
    } catch (error) {
        console.log("error - ",error)
        throw new Error(error.message)
    }
}

module.exports={
    createUser,
    findUserById,
    getUserProfileByToken,
    getUserByEmail,
    getAllUsers
}