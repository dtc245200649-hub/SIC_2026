import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { KiemChungTrucTiepPage } from './pages/KiemChungTrucTiepPage';
import { MultimodalAnalysisPage } from './pages/MultimodalAnalysisPage';
import { TextAnalysisPage } from './pages/TextAnalysisPage';
import { ImageAnalysisPage } from './pages/ImageAnalysisPage';
import { VideoAnalysisPage } from './pages/VideoAnalysisPage';
import { AudioAnalysisPage } from './pages/AudioAnalysisPage';
import { ResultXaiPage } from './pages/ResultXaiPage';
import { FactCheckPage } from './pages/FactCheckPage';
import { SocialGraphPage } from './pages/SocialGraphPage';
import { HistoryPage } from './pages/HistoryPage';
import { UserManagementPage } from './pages/UserManagementPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Application Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          {/* Mẫu chuẩn hợp nhất: Kiểm chứng trực tiếp & Giải thích XAI */}
          <Route path="checker" element={<KiemChungTrucTiepPage />} />
          <Route path="analysis/multimodal" element={<KiemChungTrucTiepPage />} />
          
          <Route path="analysis/text" element={<TextAnalysisPage />} />
          <Route path="analysis/image" element={<ImageAnalysisPage />} />
          <Route path="analysis/video" element={<VideoAnalysisPage />} />
          <Route path="analysis/audio" element={<Navigate to="/analysis/video" replace />} />
          <Route path="results/xai" element={<Navigate to="/checker" replace />} />
          <Route path="fact-check" element={<Navigate to="/checker" replace />} />
          <Route path="data" element={<Navigate to="/checker" replace />} />
          <Route path="social-graph" element={<SocialGraphPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="users" element={<UserManagementPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
