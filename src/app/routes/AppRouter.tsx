import { Spin } from 'antd';
import type { FC } from 'react';
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PprEditorPage = lazy(() => import('@/pages/PprEditorPage'));
const PprPage = lazy(() => import('@/pages/PprPage'));

const AppRouter: FC = () => (
  <Suspense
    fallback={
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    }
  >
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/ppr" element={<PprPage />} />
      <Route path="/ppr-editor" element={<PprEditorPage />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
