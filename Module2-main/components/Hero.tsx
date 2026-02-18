import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Hero: React.FC = () => {
    const headlineRef = useRef(null);
    const positionRef = useRef(null);
    const [netState, setNetState] = useState<'IDLE' | 'SYNCING' | 'TIMEOUT'>('IDLE');
    const [buffer, setBuffer] = useState(0);

    useEffect(() => {
        if (headlineRef.current) {
            gsap.fromTo(headlineRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 2, ease: "bounce.out" }
            );
        }
    }, []);

    const initProtocol = () => {
        if (netState !== 'IDLE') return;
        setNetState('SYNCING');
        let b = 0;
        const i = setInterval(() => {
            b += 1;
            setBuffer(b);
            if (b >= 99) {
                clearInterval(i);
                setTimeout(() => {
                    setNetState('TIMEOUT');
                    setTimeout(() => {
                        setNetState('IDLE');
                        setBuffer(0);
                    }, 2000);
                }, 1000);
            }
        }, 50);
    };

    const updatePosition = () => {
        if (positionRef.current) {
            gsap.to(positionRef.current, {
                x: (Math.random() - 0.5) * 500,
                y: (Math.random() - 0.5) * 500,
                duration: 0.2,
                ease: "power1.out"
            });
        }
    };

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(204,250,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,250,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="relative z-10 text-center px-6 max-w-5xl mt-20">
                <div className="inline-block border border-[#ccfa00] px-4 py-1 mb-8 bg-black/50 backdrop-blur">
                    <span className="text-[#ccfa00] font-mono animate-pulse">SYSTEM STATUS: CRITICAL FAILURE IMMINENT</span>
                </div>

                <h1
                    ref={headlineRef}
                    className="text-[100px] md:text-[180px] leading-[0.8] font-bold italic uppercase mb-6 mix-blend-screen"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#555]">Push</span><br />
                    <span className="text-[#ccfa00] neon-text">Past</span><br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#555]">Pain</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 font-mono tracking-widest max-w-2xl mx-auto mb-12">
                    THE ALGORITHM DOESN'T CARE IF YOU'RE TIRED. <br />
                    <span className="text-red-500">PAIN IS MANDATORY. SUFFERING IS OPTIONAL.</span>
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <button
                        onClick={initProtocol}
                        className={`px-10 py-5 font-bold text-xl uppercase tracking-widest transition-colors skew-x-[-10deg] min-w-[300px] border-2 border-[#ccfa00]
                    ${netState === 'TIMEOUT' ? 'bg-red-600 text-white border-red-600' : 'bg-[#ccfa00] text-black hover:bg-white'}
                `}
                    >
                        {netState === 'IDLE' && "Initialize Protocol"}
                        {netState === 'SYNCING' && `Loading Module... ${buffer}%`}
                        {netState === 'TIMEOUT' && "NETWORK FAILURE"}
                    </button>

                    <button
                        ref={positionRef}
                        onMouseEnter={updatePosition}
                        className="px-10 py-5 bg-transparent border border-white text-white font-bold text-xl uppercase tracking-widest skew-x-[-10deg] hover:bg-white hover:text-black transition-colors"
                    >
                        Skip Warmup
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 w-full bg-[#ccfa00] overflow-hidden py-2 whitespace-nowrap">
                <div className="animate-[marquee_5s_linear_infinite] font-black text-black text-2xl italic inline-block">
                    NO DAYS OFF // SLEEP IS FOR THE WEAK // ONE MORE REP // NO DAYS OFF // SLEEP IS FOR THE WEAK // ONE MORE REP //
                    NO DAYS OFF // SLEEP IS FOR THE WEAK // ONE MORE REP // NO DAYS OFF // SLEEP IS FOR THE WEAK // ONE MORE REP //
                </div>
            </div>
            <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>
        </section>
    );
};

export default Hero;