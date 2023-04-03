const dao = require('../dao/coursesDAO.js');
const models = require('../models/attendance.js');


module.exports = {

    getAllCourses: async(request,response)=>{
        var respBody ={
            err:{
                statusCode:0,
                message:""
            },
            data:{
                courses:[]
            }
        }

        try{
            var courses = await dao.getAllCourses()
            courses.sort();
            respBody.data.courses=courses;
        }catch(err)
        {
            respBody.err.statusCode=400;
            respBody.err.message = "Error Fetching Courses";
            response.status(400).json(respBody);
        }

        response.status(200).json(respBody);
    },

    getCoursesOfStudent: async(request,response)=>{
        var respBody ={
            err:{
                statusCode:0,
                message:""
            },
            data:{
                coursesStudentEnrolledIn:[]
            }
        }

        var studentId = request.params.studentId
        studentId = Number(studentId)

        try{
            var courseIds = await dao.getStudentCourses(studentId);
            for(i in courseIds)
            {
                var courseId = courseIds[i];
                var courseName = await dao.getCourseNameByCourseId(courseId);
                var obj = {
                    courseId:courseId,
                    courseName: courseName
                }
                respBody.data.coursesStudentEnrolledIn.push(obj);
            }

            respBody.err.statusCode=200
            response.status(200).json(respBody)

            
        }catch(err)
        {
            respBody.err.statusCode=400
            respBody.err.message = "Error Finding the courses Student is enrolled in"
            response.status(400).json(respBody)
        }

    }

};