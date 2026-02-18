import React from 'react';
import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black py-20 border-t border-[#222]">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold font-teko italic mb-2 tracking-tighter">ZENITH x CLIPLY</h3>
                    <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">© 2026 Non Certified Coders // All Rights Reserved</p>
                </div>

                <div className="flex gap-8">
                    <a href="#" className="text-gray-500 hover:text-[#ccfa00] transition-colors"><Github size={24} /></a>
                    <a href="#" className="text-gray-500 hover:text-[#ccfa00] transition-colors"><Twitter size={24} /></a>
                    <a href="#" className="text-gray-500 hover:text-[#ccfa00] transition-colors"><Instagram size={24} /></a>
                </div>

                <div className="text-right font-mono text-[10px] text-gray-800 hidden md:block leading-tight">
                    SYS_LOG: CONNECTION_STABLE<br />
                    LOC: 127.0.0.1:5173<br />
                    USER: RYDER_01
                </div>
            </div>
        </footer>
    );
};

export default Footer;
