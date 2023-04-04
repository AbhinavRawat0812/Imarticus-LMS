const express = require('express');

const courseServices = require('./services/courseService.js');

const router = express.Router()

module.exports = router;



//Course Activities
router.get('/getCourseName/:courseId', async(req,res)=>{ await  courseServices.getCourseName(req,res);})
router.get('/getCourseConcepts/:courseId',async(req,res)=>{ await  courseServices.getCourseConcepts(req,res);})
router.get('/getLectures/:conceptId',async(req,res)=>{ await  courseServices.getLectures(req,res);})









