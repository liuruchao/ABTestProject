import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ExperimentList from './pages/ExperimentList';
import ExperimentCreate from './pages/ExperimentCreate';
import ExperimentDetail from './pages/ExperimentDetail';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/experiments" element={<ExperimentList />} />
        <Route path="/experiments/create" element={<ExperimentCreate />} />
        <Route path="/experiments/:id" element={<ExperimentDetail />} />
      </Routes>
    </Layout>
  );
};

export default App;