import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashBoard from './dashboard';
import InstanceManager from './InstanceManager';
import FieldsListing from './FieldsListing';
import MigrationPage from './Migrations';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InstanceManager />} />
        <Route path="/migrations" element={<MigrationPage />} />
        <Route path="/objects" element={<DashBoard />} />
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/fields/:objectName" element={<FieldsListing/>}/>
      </Routes>
    </Router>
  );
};

export default App;