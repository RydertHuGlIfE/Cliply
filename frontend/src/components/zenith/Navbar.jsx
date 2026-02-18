import React, { useState } from 'react';
import { Menu, X, Monitor, User } from 'lucide-react';

const Navbar = ({ onStartNow }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // BUG FIX: Instead of printing, it triggers the start action!
    const handleStartNow = (e) => {
        e.preventDefault();
        onStartNow();
    };

    const biometricHandshake = () => {
        // Cleaner placeholder for login
        alert("BIOMETRIC ACCESS UNAVAILABLE: System requires an active recording to verify identity.");
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-[#333]">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <a href="/" className="flex items-center gap-2 group">
                    <div className="bg-[#ccfa00] p-1 rounded-md group-hover:rotate-180 transition-transform duration-500">
                        <Monitor className="text-black w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold tracking-tighter italic font-teko">CLIPLY</span>
                </a>

                <div className="hidden md:flex items-center gap-10">
                    <a href="#features" className="text-sm font-bold uppercase tracking-widest hover:text-[#ccfa00] transition-colors">
                        Features
                    </a>
                    <a href="#pricing" className="text-sm font-bold uppercase tracking-widest hover:text-[#ccfa00] transition-colors">
                        Access
                    </a>
                    <a href="#how-it-works" className="text-sm font-bold uppercase tracking-widest hover:text-[#ccfa00] transition-colors">
                        How it works
                    </a>

                    <button onClick={biometricHandshake} className="text-sm font-bold uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2">
                        <User className="w-4 h-4" /> LOGIN
                    </button>

                    <a
                        href="#"
                        onClick={handleStartNow}
                        className="px-8 py-3 bg-[#ccfa00] text-black font-bold uppercase italic -skew-x-12 hover:bg-white transition-colors font-teko text-xl"
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
                    <a href="#features" className="text-2xl font-bold uppercase text-[#ccfa00] font-teko">Features</a>
                    <a href="#pricing" className="text-2xl font-bold uppercase text-white font-teko">Access</a>
                    <a href="#how-it-works" className="text-2xl font-bold uppercase text-white font-teko">Docs</a>
                    <button onClick={handleStartNow} className="text-2xl font-bold uppercase text-white text-left font-teko">Start Recording</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
