import './App.css';
import './global.css'
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Login />}></Route>
        <Route path='/login' exact element={<Login />}></Route>
        <Route path='/home' exact element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
