// Utility to register/route all channels in the app. Used by main App router.
import CraChannel from './CraChannel';
import ProductivitySuiteChannel from './ProductivitySuiteChannel';

export const CHANNELS = [
  {
    path: '/channels/cra',
    name: 'CRA Channel',
    component: CraChannel,
    description: 'Template/placeholder Create React App channel.'
  },
  {
    path: '/channels/productivity',
    name: 'Productivity Suite Channel',
    component: ProductivitySuiteChannel,
    description: 'Upload and batch organize files using LLM extraction.'
  },
];
