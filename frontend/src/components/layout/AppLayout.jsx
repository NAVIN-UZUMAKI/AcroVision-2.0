import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="app-container">
      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="main-content">
        <AppHeader />

        <main className="page-body">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
