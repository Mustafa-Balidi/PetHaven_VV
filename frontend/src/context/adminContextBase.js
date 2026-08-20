import { useContext } from 'react';
import { AdminContext } from './AdminContext';

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used inside <AdminProvider>');
  }
  return context;
}
