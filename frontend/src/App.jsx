import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import OnePage from './OnePage';
import AdminPage from './pages/AdminPage';
import { logVisit } from './services/api';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function App() {
  // Log the site visit once when the component mounts
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    logVisit().catch(console.error).finally(() => setTimeout(() => setLoading(false), 800));
  }, []);

  // Show loading screen briefly on route change for a smooth transition
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="App">
      {loading && <LoadingScreen message="Loading..." />}
      {!loading && (
        <Routes>
          <Route path="/" element={<OnePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
