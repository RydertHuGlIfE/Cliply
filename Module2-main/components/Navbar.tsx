import React, { useState } from 'react';
import { Menu, X, Dumbbell, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const exportSchema = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  const biometricHandshake = () => {
    alert("INITIATING HANDSHAKE...");
    alert("VERIFYING BIOMETRICS");
    alert("ERROR: SENSOR NOT FOUND");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 group">
          <Dumbbell className="text-[#ccfa00] w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-3xl font-bold tracking-tighter italic">ZENITH</span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          <a href="#join" className="text-sm font-bold uppercase tracking-widest hover:text-[#ccfa00] transition-colors">
            Features
          </a>
          <a href="#features" className="text-sm font-bold uppercase tracking-widest hover:text-[#ccfa00] transition-colors">
            Pricing
          </a>
          <a href="#pricing" className="text-sm font-bold uppercase tracking-widest hover:text-[#ccfa00] transition-colors">
            Trainers
          </a>

          <button onClick={biometricHandshake} className="text-sm font-bold uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2">
            <User className="w-4 h-4" /> LOGIN
          </button>

          <a
            href="#"
            onClick={exportSchema}
            className="px-8 py-3 bg-[#ccfa00] text-black font-bold uppercase italic -skew-x-12 hover:bg-white transition-colors"
          >
            Start Now
          </a>
        </div>

        <button
          className="md:hidden text-white hover:text-[#ccfa00]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black border-b border-[#333] p-8 flex flex-col gap-6 md:hidden">
          <a href="#join" className="text-2xl font-bold uppercase text-[#ccfa00]">Features</a>
          <a href="#features" className="text-2xl font-bold uppercase text-white">Pricing</a>
          <a href="#pricing" className="text-2xl font-bold uppercase text-white">Trainers</a>
          <button onClick={exportSchema} className="text-2xl font-bold uppercase text-white text-left">Join</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;