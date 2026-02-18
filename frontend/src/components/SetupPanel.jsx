import { useState } from 'react'

export default function SetupPanel({ onStart }) {
    const [useMic, setUseMic] = useState(true)
    const [useCamera, setUseCamera] = useState(false)
    const [useSystemAudio, setUseSystemAudio] = useState(false)

    return (
        <div className="card animate-in border-t-0 p-0 overflow-hidden">
            <div className="bg-[#ccfa00] text-black px-6 py-2 font-teko text-xl italic font-bold skew-x-[-12deg] inline-block mb-8 ml-6">
                MODULE_CONFIG
            </div>

            <div className="px-10 pb-10 pt-4">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="font-teko text-4xl uppercase italic">Uplink Options</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <label className="toggle-group bg-black/40 border-[#222] hover:border-[#ccfa00]" onClick={() => setUseMic(v => !v)}>
                        <div className={`toggle-switch ${useMic ? 'on' : ''}`} />
                        <div>
                            <div className="toggle-label-title font-teko text-2xl uppercase tracking-tighter">🎙️ Micro-Array</div>
                            <div className="toggle-label-desc font-mono text-[10px] uppercase opacity-50">Capture proximity audio</div>
                        </div>
                    </label>

                    <label className="toggle-group bg-black/40 border-[#222] hover:border-[#ccfa00]" onClick={() => setUseCamera(v => !v)}>
                        <div className={`toggle-switch ${useCamera ? 'on' : ''}`} />
                        <div>
                            <div className="toggle-label-title font-teko text-2xl uppercase tracking-tighter">📷 Neural Optical</div>
                            <div className="toggle-label-desc font-mono text-[10px] uppercase opacity-50">Overlay biometric feed</div>
                        </div>
                    </label>

                    <label className="toggle-group bg-black/40 border-[#222] hover:border-[#ccfa00]" onClick={() => setUseSystemAudio(v => !v)}>
                        <div className={`toggle-switch ${useSystemAudio ? 'on' : ''}`} />
                        <div>
                            <div className="toggle-label-title font-teko text-2xl uppercase tracking-tighter">🔊 Neural Stream</div>
                            <div className="toggle-label-desc font-mono text-[10px] uppercase opacity-50">Capture internal oscillation</div>
                        </div>
                    </label>
                </div>

                {useSystemAudio && navigator.userAgent.includes('Linux') && (
                    <div className="mb-10 p-4 border-l-4 border-[#ccfa00] bg-[#ccfa00]/10 font-mono text-xs uppercase text-[#ccfa00]">
                        [SYS_WARN]: Linux systems require "Browser Tab" selection for neural stream integrity.
                    </div>
                )}

                <div className="text-center pt-6 border-t border-white/5">
                    <button
                        className="btn btn-primary w-full py-6 text-3xl"
                        onClick={() => onStart({ useMic, useSystemAudio, useCamera })}
                    >
                        Initialize Capture
                    </button>
                    <p className="font-mono text-[10px] uppercase opacity-40 mt-6 tracking-[0.2em]">
                        Waiting for selection handshake...
                    </p>
                </div>
            </div>
        </div>
    )
}
