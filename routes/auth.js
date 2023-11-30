const express=require('express');
const mongodb=require('mongodb');
const bcrypt=require('bcryptjs');
const authControllers=require('../controllers/auth-controllers');
const router=express.Router();

const db=require('../data/database');
router.get('/login',authControllers.getLogin);

router.get('/signupform',authControllers.getSignup); 

router.post('/signupform',authControllers.postSignup);

router.post('/login',authControllers.postLogin);

router.post('/logout',authControllers.postLogout);
module.exports= router;