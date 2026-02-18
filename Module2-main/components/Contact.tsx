import React, { useState, useEffect } from 'react';

const Join: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checked, setChecked] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (email.length > 0) {
        setEmail('');
        console.log("Auto-save trigger: Cache flushed.");
      }
    }, 500);
    return () => clearTimeout(autoSave);
  }, [email]);

  const validateEncoding = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    if (/^[IVXLCDM]*$/.test(val)) {
      setPhone(val);
    } else {
      alert(" ERROR: Input does not match Roman Encoding Standard (RES-2024).");
    }
  };

  const verifyHumanity = () => {
    setChecked(!checked);
  };

  const executeCommit = () => {
    setRotation(prev => prev + 5);
  };

  return (
    <section
      id="join"
      className="py-32 bg-[#ccfa00] text-black transition-transform duration-300 ease-out"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-8xl md:text-[12rem] font-bold mb-8 leading-none tracking-tighter">DO IT NOW</h2>
        <p className="text-xl font-bold mb-12 uppercase tracking-widest bg-black text-[#ccfa00] inline-block px-4">Hesitation is weakness.</p>

        <div className="flex flex-col gap-6 max-w-xl mx-auto">
          <div className="relative">
            <label className="absolute -top-3 left-4 bg-black text-[#ccfa00] px-2 text-xs font-bold">EMAIL (SPEED REQUIRED)</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-4 border-black p-6 text-2xl font-bold uppercase placeholder:text-black/30 focus:outline-none focus:bg-white"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-3 left-4 bg-black text-[#ccfa00] px-2 text-xs font-bold">PHONE (ROMAN NUMERALS)</label>
            <input
              type="text"
              value={phone}
              onChange={validateEncoding}
              className="w-full bg-transparent border-4 border-black p-6 text-2xl font-bold uppercase placeholder:text-black/30 focus:outline-none focus:bg-white"
            />
          </div>

          <div
            className="flex items-center gap-4 justify-center py-4 cursor-pointer bg-black/10 p-4 border-2 border-dashed border-black"
            onMouseEnter={verifyHumanity}
          >
            <div className={`w-8 h-8 border-4 border-black transition-colors ${checked ? 'bg-black' : 'bg-transparent'}`}></div>
            <span className="font-bold uppercase text-lg">I SURRENDER MY SOUL TO THE GYM</span>
          </div>

          <button
            onClick={executeCommit}
            className="bg-black text-white px-12 py-8 text-4xl font-black italic uppercase hover:bg-white hover:text-black transition-colors shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2"
          >
            Commit
          </button>
        </div>
        <p className="mt-8 text-xs font-mono opacity-60">*Typing pause of &gt;0.5s results in session termination. <br /> By clicking Commit, you agree to mandatory 4AM wake up calls.</p>
      </div>
    </section>
  );
};

export default Join;