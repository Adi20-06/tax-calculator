import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Calculator from './pages/Calculator';
import SalaryStructure from './pages/SalaryStructure';
import Compare from './pages/Compare';
import History from './pages/History';
import About from './pages/About';
import SharedResult from './pages/SharedResult';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Calculator />} />
        <Route path="/salary-structure" element={<SalaryStructure />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/shared/:id" element={<SharedResult />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default App;