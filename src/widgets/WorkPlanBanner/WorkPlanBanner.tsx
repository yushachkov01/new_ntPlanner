import { ExceptionOutlined } from '@ant-design/icons';
import type { FC } from 'react';

import './WorkPlanBanner.css';
import type { Props } from '@/shared/types.ts';

const WorkPlanBanner: FC<Props> = ({ title = 'План твоих работ:' }) => (
  <div className="work-plan-banner">
    <ExceptionOutlined className="work-plan-icon" />
    <span className="work-plan-text">{title}</span>
  </div>
);

export default WorkPlanBanner;
