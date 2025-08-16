import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SettingsPage from "./Pages/Settings";
import Market from "./Pages/Market";
import CoinDetails from "./Pages/CoinDetails";
// import Dashboard from './Dashboard';
// ... other components

function App() {
  return (
    <div className="app-container bg-black min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />*/}
          <Route path="/markets" element={<Market />} />
          <Route path="/coin/:coinId" element={<CoinDetails />} />
          {/* <Route path="/portfolio" element={<Portfolio />} /> */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;