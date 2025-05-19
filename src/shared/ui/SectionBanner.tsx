import type { FC } from 'react';
import React from 'react';
import './SectionBanner.css';

interface Props {
  icon: React.ReactNode;
  title: string;
}

const SectionBanner: FC<Props> = ({ icon, title }) => (
  <div className="section-banner">
    <div className="section-banner-icon">{icon}</div>
    <div className="section-banner-text">{title}</div>
  </div>
);

export default SectionBanner;
