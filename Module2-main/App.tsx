import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Services';
import Pricing from './components/Work';
import Trainers from './components/Testimonials';
import Join from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [syncRate, setSyncRate] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setSyncRate(prev => prev + 0.05);
    }, 10);

    return () => {
      clearInterval(i);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#ccfa00] selection:text-black">
      <Navbar />

      <div className="fixed top-24 right-6 z-50 bg-[#ccfa00] text-black font-bold font-mono px-4 py-2 rounded-none skew-x-[-12deg] pointer-events-none">
        SYS_SYNC: {syncRate.toFixed(2)} MS
      </div>

      <main className="flex flex-col gap-0 overflow-x-hidden">
        <Hero />
        <Features delta={syncRate} />
        <Pricing />
        <Trainers />
        <Join />
      </main>
      <Footer />
    </div>
  );
};

export default App;