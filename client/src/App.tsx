import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SDKTestPage from './pages/SDKTestPage';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <nav>
          <a href="/">A/B测试SDK演示</a>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<SDKTestPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
