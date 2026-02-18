import React, { useState } from 'react';

const Work = () => {
    // BUG FIX: Actual Cliply tiers instead of random pricing
    const tiers = [
        { name: "GUEST", price: "FREE", color: "bg-[#1a1a1a]", features: ["5-Minute Recordings", "Standard Mime Types", "Canvas Annotations", "No Login Required"] },
        { name: "MEMBER", price: "FREE", color: "bg-[#ccfa00]", text: "text-black", features: ["15-Minute Recordings", "Password Sharing", "Auto-Cleanup", "Persistent Clips"] },
        { name: "CORE", price: "FREE", color: "bg-[#1a1a1a]", features: ["Infinite Loops", "Biometric Handshake", "Priority Uploads", "Neural Uplink"] }
    ];

    return (
        <section id="pricing" className="py-32 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-right text-8xl font-bold mb-20 text-transparent bg-clip-text bg-gradient-to-r from-[#ccfa00] to-white font-teko leading-[0.8]">
                    UPLINK<br />PERMISSION
                </h2>

                <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch">
                    {tiers.map((plan, index) => (
                        <div
                            key={index}
                            className={`
                ${plan.color} ${plan.text || 'text-white'}
                w-full md:w-1/3 p-12 flex flex-col items-center justify-center border-4 border-black
                transition-transform duration-300 hover:scale-110 hover:z-50
                md:-ml-10 first:ml-0 shadow-2xl relative
              `}
                            style={{ zIndex: index * 10 }}
                        >
                            <h3 className="text-5xl font-bold mb-4 italic font-teko tracking-tight">{plan.name}</h3>
                            <div className="text-7xl font-bold mb-8 font-teko">{plan.price}</div>
                            <ul className="text-center space-y-4 mb-8 font-mono text-sm opacity-70 font-bold">
                                {plan.features.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                                <li className="line-through opacity-50">Physical Reality</li>
                            </ul>
                            <button
                                className={`px-8 py-4 font-bold uppercase transition-colors border-2 w-full font-teko text-2xl
                  ${plan.text ? 'bg-black text-white hover:bg-white hover:text-black hover:border-black' : 'bg-[#ccfa00] text-black hover:bg-white hover:border-transparent'}
                `}
                                onClick={() => document.getElementById('recorder-panel')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Sync Now
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-center mt-12 text-gray-500 font-mono text-xs">
                    *Access levels are granted based on your commitment to the code.
                </p>
            </div>
        </section>
    );
};

export default Work;
