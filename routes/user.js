import express from 'express'

const router = express.Router();

import  {getAllUser,getUserById} from '../controllers/userController.js'

router.get("/",getAllUser)

router.get('/profile',getUserById)

export default router