const dao = require('../dao/coursesDAO.js');


module.exports = {

    getCourseName: async(request,response)=>{
        var respBody ={
            success:Boolean,
            data:{}
        }
        var courseId = request.params.courseId
        courseId = Number(courseId);
        try{
            var course = await dao.getCourseNameByCourseId(courseId);
            respBody.success=true;
            respBody.data=course;
        }catch(err)
        {
            respBody.success=false;
            response.status(400).json(respBody);
        }

        if(course==null)
        {
            respBody.success=false;
            response.status(400).json(respBody)
        }
        response.status(200).json(respBody);
    },

    getCourseConcepts: async(request,response)=>{
        var respBody ={
            success:Boolean,
            data:{}
        }
        var courseId = request.params.courseId
        courseId = Number(courseId);
        try{
            var courseConcepts = await dao.getCourseConcepts(courseId);
            if(courseConcepts==null)
                throw err;
            respBody.success=true;
            respBody.data=courseConcepts;
        }catch(err)
        {
            respBody.success=false;
            response.status(400).json(respBody);
        }
        response.status(200).json(respBody);
    },
    getLectures: async(request,response)=>{
        var respBody ={
            success:Boolean,
            data:{}
        }
        var conceptId = request.params.conceptId
        conceptId = Number(conceptId);

        try{
            var lectures = await dao.getLectures(conceptId);
            if(lectures==null)
                throw err;
            respBody.success=true;
            respBody.data={
                lectureName:lectures[0].lectureName,
                lectureDuration:lectures[0].lectureDurationHours+":"+lectures[0].lectureDurationMin
            }
        }catch(err)
        {
            respBody.success=false;
            // response.status(400).json(respBody);
        }
        response.status(200).json(respBody);
    }
    

};