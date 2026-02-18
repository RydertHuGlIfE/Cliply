import React, { useState } from 'react';

const Trainers: React.FC = () => {
  const trainers = [
    { img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop", name: "UNIT 1" },
    { img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop", name: "UNIT 2" },
    { img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", name: "UNIT 3" }
  ];

  return (
    <section id="trainers" className="py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-7xl font-bold mb-12 text-left border-b border-[#333] pb-4">OPERATORS</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((t, i) => (
            <TrainerCard key={i} data={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TrainerData {
  img: string;
  name: string;
}

interface TrainerCardProps {
  data: TrainerData;
  index: number;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ data, index }) => {
  const [status, setStatus] = useState("BOOK SESSION");

  const checkAvailability = () => {
    const codes = ["HATES YOU", "BUSY", "NO", "TOO WEAK"];
    setStatus(codes[index % codes.length]);
  };

  const resetStatus = () => {
    setStatus("BOOK SESSION");
  };

  return (
    <div className="relative group overflow-hidden aspect-[3/4] border border-[#222]">
      <img
        src={data.img}
        className="w-full h-full object-cover filter grayscale group-hover:invert group-hover:contrast-200 transition-all duration-75"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        <button
          onMouseEnter={checkAvailability}
          onMouseLeave={resetStatus}
          className="bg-[#ccfa00] text-black px-8 py-4 font-bold text-2xl uppercase -rotate-6 hover:bg-red-600 hover:text-white transition-colors w-64 text-center cursor-not-allowed"
        >
          {status}
        </button>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 bg-black border-t border-[#ccfa00]">
        <h3 className="text-3xl font-bold text-[#ccfa00]">{data.name}</h3>
        <p className="text-sm font-mono text-gray-400">PAIN SPECIALIST</p>
      </div>
    </div>
  );
};

export default Trainers;