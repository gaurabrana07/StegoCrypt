import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Encode from './pages/Encode';
import Decode from './pages/Decode';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encode" element={<Encode />} />
          <Route path="/decode" element={<Decode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
