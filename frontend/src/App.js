import Course from './pages/coursePage'
import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Login from './pages/SignIn';
import StateMiddleware from './pages/StateMiddleware';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<StateMiddleware />}>
            <Route path="/courses" element={<Course />} />
          </Route>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
