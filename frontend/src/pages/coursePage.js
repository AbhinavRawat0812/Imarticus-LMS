import './styles/coursePage.css';
import SideBar from '../components/sideMenu'
import Navbar from '../components/Navbar';
import { Button } from 'bootstrap';
import { useEffect } from 'react';
import { useState } from 'react';



export default function CoursePage() {

    const [courseName, setCourseName] = useState('');
    const [batch, setBatch] = useState('');
    const [concepts, setConcepts] = useState([]);
    const [viewLectures,setViewLectures] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:4500/api/getCourseName/201', {
            method: 'GET',
            'Content-type': 'application/json'
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res)
                setCourseName(res.data.courseName)
                setBatch(res.data.batch)
            })
    }, [])

    useEffect(() => {
        fetch('http://127.0.0.1:4500/api/getCourseConcepts/201', {
            method: 'GET',
            'Content-type': 'application/json'
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res)
                setConcepts(res.data)
            })
        console.log(concepts)
        console.log(courseName)
    }, [])

    const getLectureDetail = (conceptId) => {
        console.log(conceptId)
    }


    return (
        <>
            <div className="coursePageContainer d-flex">
                <SideBar />
                <Navbar course={courseName} />
            </div>
            <div className='main-container'>

                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item" style={{ fontWeight: "500", fontSize: "22px" }}><a href='#' style={{ textDecoration: "none", color: "green" }}>All Courses</a></li>
                        <li class="breadcrumb-item" style={{ fontWeight: "500", fontSize: "22px" }}><a href='#' style={{ textDecoration: "none", color: "green" }}>{courseName}</a></li>
                    </ol>
                </nav>

                <div className='course-detail-container'>
                    <div class="d-flex ml-4 mt-4 courseInfo">
                        <div class="flex-shrink-0">
                            <img src='https://cdn.eckovation.com/images/Introduction-to-Machine-Learning.png' width="100%" height="80%" style={{ borderRadius: "10px" }} />
                        </div>
                        <div class="flex-grow-1 ms-4">
                            <h2>{courseName}</h2>
                            <div>
                                <span id='batch'>Batch: {batch}</span>
                            </div>
                            <h6>0% Complete</h6>
                        </div>
                    </div>
                    {concepts.map((concept, key) => {
                        return (
                            <div key={key} className='lectures' role="button" onClick={()=>getLectureDetail(concept.conceptId)}>
                                <h4>{concept.concept_name}</h4>
                                <span style={{ position: "absolute", right: "5%", top: "15%" }}>+</span>
                                <p className='concept-font'>
                                    {concept.noOfLectures} Lectures
                                    {(concept.noOfQuizes>0)&&<span className='concept-font'>
                                        , {concept.noOfQuizes} Quiz
                                    </span>}
                                </p>
                                {viewLectures&&<div>
                                    Hey
                                </div>}
                            </div>
                        );
                    })}



                </div>

                <div className='certificate-container'>
                    <div class="d-flex ml-4 mt-4">
                        <div class="flex-shrink-0">
                            <img src="https://cdn.eckovation.com/courses/images/leran-cetificate-icon.svg" alt="Image" />
                        </div>
                        <div class="flex-grow-1 ms-4">
                            <h3>Certificate</h3>
                            <span>-----------------------------------------------------------------------</span>
                            <p>Complete the course to download the certificate</p>

                        </div>
                    </div>

                </div>
            </div>

        </>
    );
}