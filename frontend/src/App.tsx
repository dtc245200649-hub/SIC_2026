import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// VietXAI 5 Standard Intelligence Views
import { OverviewPage } from './pages/OverviewPage';
import { VerificationXaiPage } from './pages/VerificationXaiPage';
import { PropagationGnnPage } from './pages/PropagationGnnPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { SocialRadarPage } from './pages/SocialRadarPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected VietXAI Intelligence Platform Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Tab 1: Tổng quan (Image 1) */}
          <Route index element={<OverviewPage />} />
          <Route path="tong-quan" element={<OverviewPage />} />
          <Route path="dashboard" element={<OverviewPage />} />

          {/* Tab 2: Kiểm chứng & XAI (Image 2) */}
          <Route path="kiem-chung" element={<VerificationXaiPage />} />
          <Route path="verification" element={<VerificationXaiPage />} />
          <Route path="checker" element={<VerificationXaiPage />} />
          <Route path="analysis" element={<VerificationXaiPage />} />
          <Route path="analysis/multimodal" element={<VerificationXaiPage />} />
          <Route path="analysis/text" element={<VerificationXaiPage />} />
          <Route path="analysis/image" element={<VerificationXaiPage />} />
          <Route path="analysis/video" element={<VerificationXaiPage />} />
          <Route path="results/xai" element={<VerificationXaiPage />} />

          {/* Tab 3: Lan truyền (Image 3) */}
          <Route path="lan-truyen" element={<PropagationGnnPage />} />
          <Route path="propagation" element={<PropagationGnnPage />} />
          <Route path="social-graph" element={<PropagationGnnPage />} />
          <Route path="gnn" element={<PropagationGnnPage />} />

          {/* Tab 4: Cơ sở Tri thức (Image 4) */}
          <Route path="tri-thuc" element={<KnowledgeBasePage />} />
          <Route path="fact-check" element={<KnowledgeBasePage />} />
          <Route path="data" element={<KnowledgeBasePage />} />

          {/* Tab 5: Giám sát MXH (Image 5) */}
          <Route path="giam-sat" element={<SocialRadarPage />} />
          <Route path="history" element={<Navigate to="/" replace />} />
          <Route path="users" element={<Navigate to="/" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
