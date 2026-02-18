import React from 'react';

const Testimonials = () => {
    return (
        <section id="trainers" className="py-32 bg-[#080808] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ccfa00] to-transparent opacity-30"></div>

            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-8xl font-bold mb-20 font-teko tracking-normal">OPERATIVES</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { name: "VECTOR", role: "UI/UX DESTRUCTOR", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
                        { name: "GHOST", role: "BACKEND SPECTRE", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop" },
                        { name: "NULL", role: "DEBUG EXORCIST", img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=2071&auto=format&fit=crop" },
                        { name: "VOID", role: "LEAD ARCHITECT", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048&auto=format&fit=crop" }
                    ].map((op, i) => (
                        <div key={i} className="group relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                            <img src={op.img} alt={op.name} className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <h3 className="text-3xl font-bold font-teko text-[#ccfa00] leading-none mb-1">{op.name}</h3>
                                <p className="text-xs font-mono text-gray-400 tracking-tighter uppercase">{op.role}</p>
                            </div>
                            <div className="absolute top-4 right-4 bg-[#ccfa00] text-black font-black px-2 py-1 text-xs skew-x-[-12deg]">
                                LVL_{99 - i}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
