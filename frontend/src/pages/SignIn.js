import './styles/Login.css'
import { useRef, useState, useEffect } from 'react';
import useAuth from '../realm/useAuth';
import { Link, Navigate } from 'react-router-dom';


export default function Login() {

  const { setAuth } = useAuth();
  const { auth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    var body = {
      "username": user,
      "password": pwd
    }
    fetch('/api/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res)
        if (res.message === "Login Successfull") {
          setSuccess(true);
          const name = res.user.name
          const courseId = res.user.courseId
          setAuth({ user, pwd, name, courseId })
        }
        else {
          setSuccess(false);
          setErrMsg(res.message);
        }
      })
      .catch((err) => {
        if (!err.response.status === 400)
          setErrMsg('Invalid Username or Password');
        else
          setErrMsg("Invalid Login")

        errRef.current.focus();
      })
    setUser('');
    setPwd('');
  }

  return (
    <>

      {success ? (
        <>
          <Navigate to="/courses" />

        </>

      ) : (
        <>
  
          <div className="container">
            <h1 align='center'>LOGIN</h1>
            <hr />
            <form onSubmit={handleSubmit} className="form">
              <label for="username">Username:</label><br />
              <input type="text"
                id="username"
                name="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />

              <br />
              <label for="password">Password</label><br />
              <input type="text"
                id="password"
                name="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <br />
              <input type="checkbox" />
              <span>I am not a robot</span><br />
              <input type="submit" id="formloginbutton" value='Login' />
            </form>
            {(errMsg !== '') && <div className='errBox'>{errMsg}</div>}
          </div>
        </>

      )}

    </>

  )
}