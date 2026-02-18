export default function RecordingPanel({ elapsed, isPaused, onStop, onPause, onCancel }) {
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0')
    const s = String(elapsed % 60).padStart(2, '0')

    return (
        <div className="card animate-in border-t-0 p-0 overflow-hidden">
            <div className="bg-[#ccfa00] text-black px-6 py-2 font-teko text-xl italic font-bold skew-x-[-12deg] inline-block mb-4 ml-6">
                LIVE_RECORDING_STREAM
            </div>

            <div className="text-center px-10 pb-10 pt-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ccfa00] mb-4">
                    {isPaused ? '[STREAM_PAUSED]' : '[UPLINK_ACTIVE]'}
                </div>

                <div className="timer">{m}:{s}</div>

                <div className={`waveform ${isPaused ? '' : 'active'}`}>
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="waveform-bar" style={{ width: '2px' }} />
                    ))}
                </div>

                <div className="flex items-center justify-center gap-6 mt-10">
                    <button className="btn btn-secondary flex-1" onClick={onPause}>
                        {isPaused ? '▶ RESUME_SESSION' : '⏸ PAUSE_SESSION'}
                    </button>
                    <button
                        className="w-20 h-20 bg-red-600 hover:bg-white text-white hover:text-black transition-colors flex items-center justify-center text-3xl skew-x-[-12deg]"
                        onClick={onStop}
                        title="Stop Recording"
                    >
                        ⏹
                    </button>
                </div>

                <button className="btn btn-danger w-full mt-6 opacity-50 hover:opacity-100" onClick={onCancel}>
                    ABORT_STATION
                </button>
            </div>
        </div>
    )
}
