import React, { useState } from 'react';

const Contact = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, TRANSMITTING, SUCCESS
    const [msg, setMsg] = useState('');

    const handleSubmit = async () => {
        if (!email || !email.includes('@')) {
            setMsg('INVALID_IDENTITY_STRING');
            setTimeout(() => setMsg(''), 2000);
            return;
        }

        setStatus('TRANSMITTING');

        try {
            const res = await fetch('http://localhost:5000/api/beta/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setTimeout(() => {
                    setStatus('SUCCESS');
                }, 1500);
            } else {
                setMsg('TRANSMISSION_FAILED');
                setStatus('IDLE');
            }
        } catch (e) {
            setMsg('UPLINK_OFFLINE');
            setStatus('IDLE');
        }
    };

    return (
        <section id="join" className="py-32 bg-black relative">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-[120px] md:text-[200px] font-bold leading-none font-teko mb-8 italic">
                    {status === 'SUCCESS' ? 'UPLINK' : 'JOIN'} <span className="text-[#ccfa00]">{status === 'SUCCESS' ? 'READY' : 'VOID'}</span>
                </h2>
                <p className="text-2xl font-mono text-gray-400 mb-12 tracking-widest uppercase">
                    {status === 'SUCCESS' ? 'YOUR FOOTPRINT HAS BEEN LOGGED. WATCH THE CLEARING.' : 'ESTABLISH YOUR DIGITAL FOOTPRINT OR BE FORGOTTEN'}
                </p>

                {status !== 'SUCCESS' ? (
                    <div className={`flex flex-col md:flex-row gap-4 justify-center ${status === 'TRANSMITTING' ? 'uplink-active' : ''}`}>
                        <div className="relative w-full md:w-96">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'TRANSMITTING'}
                                placeholder={status === 'TRANSMITTING' ? 'UPLOADING...' : 'NEURAL_EMAIL@SYSTEM.COM'}
                                className="bg-[#111] border-2 border-[#333] px-8 py-5 text-white font-mono focus:border-[#ccfa00] outline-none transition-colors w-full"
                            />
                            {msg && (
                                <div className="absolute -bottom-8 left-0 text-red-500 font-mono text-xs font-bold">
                                    [ERR]: {msg}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={status === 'TRANSMITTING'}
                            className="bg-[#ccfa00] text-black font-bold uppercase py-5 px-12 skew-x-[-12deg] hover:bg-white transition-colors font-teko text-2xl disabled:opacity-50"
                        >
                            {status === 'TRANSMITTING' ? 'Transmitting...' : 'Submit Data'}
                        </button>
                    </div>
                ) : (
                    <div className="inline-block border-2 border-[#ccfa00] px-12 py-6 bg-[#ccfa00]/10 font-teko text-4xl italic text-[#ccfa00] uppercase tracking-tighter">
                        Beta Access Initialized // Data Secured
                    </div>
                )}
            </div>
        </section>
    );
};

export default Contact;
