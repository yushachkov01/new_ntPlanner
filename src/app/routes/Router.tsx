import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardPage from '@pages/DashboardPage/ui/DashboardPage.tsx';
import PprPage from '@pages/PprPage';
import { TestPage } from '@pages/TestPage/ui/TestPage.tsx';

const AppRouter: FC = () => (
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
    <Route path="/ppr" element={<PprPage />} />
    <Route path="/test" element={<TestPage />} />
  </Routes>
);

export default AppRouter;
