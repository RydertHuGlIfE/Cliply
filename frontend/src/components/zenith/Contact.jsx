import React from 'react';

const Contact = () => {
    return (
        <section id="join" className="py-32 bg-black relative">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-[120px] md:text-[200px] font-bold leading-none font-teko mb-8 italic">
                    JOIN <span className="text-[#ccfa00]">VOID</span>
                </h2>
                <p className="text-2xl font-mono text-gray-400 mb-12 tracking-widest uppercase">
                    ESTABLISH YOUR DIGITAL FOOTPRINT OR BE FORGOTTEN
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <input
                        type="email"
                        placeholder="NEURAL_EMAIL@SYSTEM.COM"
                        className="bg-[#111] border-2 border-[#333] px-8 py-5 text-white font-mono focus:border-[#ccfa00] outline-none transition-colors w-full md:w-96"
                    />
                    <button className="bg-[#ccfa00] text-black font-bold uppercase py-5 px-12 skew-x-[-12deg] hover:bg-white transition-colors font-teko text-2xl">
                        Submit Data
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Contact;
