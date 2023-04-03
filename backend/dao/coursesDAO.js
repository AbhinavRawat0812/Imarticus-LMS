const dbUtils = require('../dbUtils/databaseConn.js')

module.exports = {

    getAllCourses: async function(){

        try{
            let collection = await dbUtils.GetMongoCollection("Courses");
            var courses = await collection.find().toArray();
            var result = []

            for(i in courses){
                
                result.push(courses[i].courseId);
            }

            return result;

        }catch(err)
        {
            return err;
        }
    },

    getStudentCourses: async function(studentId){
        try{
            let collection = await dbUtils.GetMongoCollection("Students");
            let student = await collection.findOne({"studentId":studentId});
            return student.coursesEnrolledIn;

        }catch(err)
        {
            return err;
        }
    },

    getCourseNameByCourseId: async function(courseId){
        try{

            let collection = await dbUtils.GetMongoCollection("Courses");
            var course = await collection.findOne({"courseId":courseId});
            return course.courseName;
        }catch(err)
        {
            return err;
        }
    }
}