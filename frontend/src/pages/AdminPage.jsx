import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import PasswordPrompt from '../components/PasswordPrompt';
import './AdminPage.css';

const AdminPage = () => {
  // Use sessionStorage to keep the user "logged in" during their session.
  const [adminKey, setAdminKey] = useState(sessionStorage.getItem('adminKey'));

  const handleCorrectPassword = (key) => {
    sessionStorage.setItem('adminKey', key);
    setAdminKey(key);
  };

  return (
    <div className="admin-page">
      {!adminKey ? (
        <PasswordPrompt onCorrectPassword={handleCorrectPassword} />
      ) : (
        <>
          <h1>Admin Dashboard</h1>
          <p>Review and approve guest submissions.</p>
          <AdminDashboard adminKey={adminKey} />
        </>
      )}
    </div>
  );
};

export default AdminPage;
