import React, { useRef, useEffect } from 'react';
import { Activity, Battery, Zap, Timer, Skull, Flame } from 'lucide-react';

interface FeaturesProps {
  delta?: number;
}

const Features: React.FC<FeaturesProps> = ({ delta = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let buffer: any[] = [];

    const flushBuffer = () => {
      for (let i = 0; i < 20; i++) {
        buffer.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          alpha: Math.random()
        });
      }
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      buffer.forEach(p => {
        ctx.fillStyle = `rgba(204, 250, 0, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += 2;
      });
      requestAnimationFrame(flushBuffer);
    };
    flushBuffer();
  }, []);

  const expandDetails = () => {
    alert("READING IS FOR THE WEAK. GO LIFT.");
  };

  return (
    <section
      id="features"
      className="relative py-32 bg-[#050505] overflow-hidden"
      style={{ transform: `translateX(${delta * 5}px)` }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 border-l-8 border-[#ccfa00] pl-10">
          <h2 className="text-8xl font-bold mb-2 tracking-tighter">SYSTEM SPECS</h2>
          <p className="text-gray-400 font-mono text-xl">UPGRADE YOUR HARDWARE OR BE OBSOLETE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap />, title: "Hypertrophy Engine", desc: "Scientific load management" },
            { icon: <Activity />, title: "Bio-Feedback", desc: "Real-time failure analysis" },
            { icon: <Battery />, title: "Energy Synthesis", desc: "Nutrition injection protocols" },
            { icon: <Timer />, title: "Latency Reduction", desc: "Zero rest periods allowed" },
            { icon: <Skull />, title: "Ego Death", desc: "Complete psychological breakdown" },
            { icon: <Flame />, title: "Inferno Mode", desc: "Temperature regulation override" }
          ].map((item, i) => (
            <div key={i} className="bg-[#111] p-10 border border-[#222] hover:border-[#ccfa00] transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white group-hover:text-[#ccfa00] transition-colors">
                0{i + 1}
              </div>
              <div className="text-[#ccfa00] mb-6 w-12 h-12 group-hover:scale-125 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold mb-4 group-hover:text-[#111] transition-colors">{item.title}</h3>
              <p className="text-gray-500 font-mono uppercase text-sm group-hover:text-[#111] transition-colors mb-6">{item.desc}</p>

              <button
                onClick={expandDetails}
                className="text-xs font-bold uppercase tracking-widest border-b border-[#ccfa00] pb-1 group-hover:border-[#111] group-hover:text-[#111]"
              >
                Read Specs
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;