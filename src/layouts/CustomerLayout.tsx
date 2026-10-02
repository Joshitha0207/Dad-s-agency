import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { MobileBottomNav } from '../components/navbar/MobileBottomNav';
import { Footer } from '../components/footer/Footer';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4E342E] flex flex-col font-sans antialiased selection:bg-pink-200 selection:text-pink-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
