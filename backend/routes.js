const express = require('express');
const Model = require('./models/users');
const dbUtils = require('./dbUtils/databaseConn.js');
const loginServices = require('./services/loginService.js');
const courseServices = require('./services/courseService.js');
const attendanceServices = require('./services/attendanceService.js');
const router = express.Router()

module.exports = router;



//Login
router.post('/login',async(req,res)=>{ await loginServices.validateLogin(req,res);})

//Attendance Activities
router.get('/viewAttendance/:courseId/:studentId', async(req,res)=>{ await attendanceServices.viewAttendance(req,res);})
router.get('/getStudents/:courseId', async(req,res)=>{ await attendanceServices.getStudents(req,res);})
router.post('/updateAttendance', async(req,res)=>{ await attendanceServices.updateAttendance(req,res);})

//Course Activities
router.get('/getAllCourses', async(req,res)=>{ await  courseServices.getAllCourses(req,res);})
router.get('/getCourses/:studentId', async(req,res)=>{ await courseServices.getCoursesOfStudent(req,res);})


//User Activities
router.post('/addUser', async(req, res) => { await services.addUser(req,res);})
router.get('/getAllUsers', async(req,res) => { await services.getAllUsers(req,res);})






