import Course from './pages/coursePage'
import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Course />} />
          <Route path="/courses" element={<Course />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
