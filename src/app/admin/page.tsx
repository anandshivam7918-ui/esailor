import { Metadata } from 'next';
import { AdminDashboardClient } from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | eSailor.in CMS',
  description: 'Secure B2B Product and Quote Request Management Dashboard for eSailor.in',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
