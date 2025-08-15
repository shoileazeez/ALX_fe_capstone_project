import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
// import Dashboard from './Dashboard';
// import Markets from './Markets';
// ... other components

function App() {
  return (
    <div className="app-container bg-black min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;