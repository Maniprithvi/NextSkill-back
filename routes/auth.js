import express from 'express'
import authController from '../controllers/authcontroller.js'

const router = express.Router();

router.post('signup', authController.register)
router.post("/signin",authController.login)
