const express = require('express');

const courseServices = require('./services/courseService.js');
const loginServices = require('./services/loginService.js');
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.CLIENT_ID);

const router = express.Router()

module.exports = router;



//Course Activities
router.get('/getCourseName/:courseId', async(req,res)=>{ await  courseServices.getCourseName(req,res);})
router.get('/getCourseConcepts/:courseId',async(req,res)=>{ await  courseServices.getCourseConcepts(req,res);})
router.get('/getLectures/:conceptId',async(req,res)=>{ await  courseServices.getLectures(req,res);})

//Login Activities

router.post('/login',async(req,res)=>{ await  loginServices.validateLogin(req,res);})

// router.get('/auth/google', async (req, res) => {
//   const toke = req.query;
//   const ticket = await client.verifyIdToken({
//     idToken: toke,
//     audience: process.env.CLIENT_ID
//   });
// });








