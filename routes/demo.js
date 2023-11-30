const express=require('express');

const bcrypt=require('bcryptjs');
const Post=require('../models/post');
const blogControllers=require('../controllers/post-controllers');

const router=express.Router(); 
const db=require('../data/database');

router.get('/',blogControllers.getHome);

router.get('/admin',blogControllers.getAdmin);

router.get('/profile',);

router.post('/posts',blogControllers.createPost);

router.get('/posts/:id/edit',blogControllers.getSinglepost);

router.post('/posts/:id/edit', blogControllers.updatePost);

router.post('/posts/:id/delete',blogControllers.deletePost);
module.exports= router;