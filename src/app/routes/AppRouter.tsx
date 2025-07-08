import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardPage from '@pages/DashboardPage/ui/DashboardPage.tsx';
import PprEditorPage from '@pages/PprEditorPage';
import PprPage from '@pages/PprPage';

const AppRouter: FC = () => (
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
    <Route path="/ppr" element={<PprPage />} />
    <Route path="/ppr-editor" element={<PprEditorPage />} />
  </Routes>
);

export default AppRouter;
