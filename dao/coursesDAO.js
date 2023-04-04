const dbUtils = require('../dbUtils/databaseConn.js')

module.exports = {

    getCourseConcepts: async function(courseId){

        try{
            let collection = await dbUtils.GetMongoCollection("Course");
            var course = await collection.findOne({"courseId":courseId});
            return course.concept;

        }catch(err)
        {
            return err;
        }
    },

    getCourseNameByCourseId: async function(courseId){
        try{

            let collection = await dbUtils.GetMongoCollection("Course");
            var course = await collection.findOne({"courseId":courseId});
            var obj = {
                courseName:course.courseName,
                batch:course.batch
            }
            return obj;
        }catch(err)
        {
            return err;
        }
    },
    getLectures: async function(conceptId){
        try{

            let collection = await dbUtils.GetMongoCollection("Lectures");
            var lecture = await collection.findOne({"conceptId":conceptId});
            
            return lecture.lecture;
        }catch(err)
        {
            return err;
        }
    }
}