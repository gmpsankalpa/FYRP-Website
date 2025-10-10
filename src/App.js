import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Download from './pages/Download';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Error404 from './pages/Error404';

function App() {
  return (
    <Router>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/download" element={<Download />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* 404 Catch-All Route (MUST BE LAST) */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
        <Footer />
    </Router>
  );
}

export default App;
