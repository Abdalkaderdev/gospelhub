import React from 'react';
import { BibleEnhanced } from '../components/BibleEnhanced';
import { MainLayout } from './layouts/MainLayout';

export const Enhanced: React.FC = () => {
  return (
    <MainLayout title="Gospel Hub - Enhanced Study">
      <BibleEnhanced />
    </MainLayout>
  );
};