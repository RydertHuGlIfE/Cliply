import React, { useState } from 'react';

const Pricing: React.FC = () => {
  const [plans, setPlans] = useState(["$29", "$59", "$99"]);

  const refreshDynamicPricing = () => {
    const recalibrated = [...plans].sort(() => Math.random() - 0.5);
    setPlans(recalibrated);
  };

  return (
    <section id="pricing" className="py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-right text-8xl font-bold mb-20 text-transparent bg-clip-text bg-gradient-to-r from-[#ccfa00] to-white">
          ACCESS<br />LEVELS
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch">
          {[
            { name: "BASIC", price: plans[0], color: "bg-[#1a1a1a]", z: "z-10" },
            { name: "PRO", price: plans[1], color: "bg-[#ccfa00]", text: "text-black", z: "z-20" },
            { name: "ELITE", price: plans[2], color: "bg-[#1a1a1a]", z: "z-30" }
          ].map((plan, index) => (
            <div
              key={index}
              className={`
                ${plan.color} ${plan.text || 'text-white'} ${plan.z}
                w-full md:w-1/3 p-12 flex flex-col items-center justify-center border-4 border-black
                transition-transform duration-300 hover:scale-110 hover:z-50
                md:-ml-10 first:ml-0 shadow-2xl
              `}
            >
              <h3 className="text-5xl font-bold mb-4 italic">{plan.name}</h3>
              <div className="text-7xl font-bold mb-8">{plan.price}<span className="text-sm">/MO</span></div>
              <ul className="text-center space-y-4 mb-8 font-mono text-sm opacity-70 font-bold">
                <li>Gym Access</li>
                <li>Locker Room</li>
                <li>{index > 0 ? 'Sauna Access' : 'No Sauna'}</li>
                <li>{index > 1 ? 'Personal Trainer' : 'No Trainer'}</li>
                <li className="line-through opacity-50">Cancel Anytime</li>
              </ul>
              <button
                onClick={refreshDynamicPricing}
                className="px-8 py-4 bg-black text-white font-bold uppercase hover:bg-white hover:text-black transition-colors border-2 border-transparent hover:border-black w-full"
              >
                Select
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-gray-500 font-mono text-xs">
          *Prices subject to change based on your heart rate variability.
        </p>
      </div>
    </section>
  );
};

export default Pricing;