export default function RecordingPanel({ elapsed, isPaused, onStop, onPause, onCancel }) {
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0')
    const s = String(elapsed % 60).padStart(2, '0')

    return (
        <div className="card animate-in">
            <div className="text-center" style={{ padding: '32px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                    {isPaused ? 'Paused' : 'Recording'}
                </div>

                <div className="timer">{m}:{s}</div>

                <div className={`waveform ${isPaused ? '' : 'active'}`}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="waveform-bar" />
                    ))}
                </div>

                <div className="flex items-center justify-center gap-12 flex-wrap mt-24">
                    <button className="btn btn-secondary" onClick={onPause}>
                        {isPaused ? '▶ Resume' : '⏸ Pause'}
                    </button>
                    <button className="record-btn record-btn-stop" onClick={onStop} title="Stop Recording">
                        ⏹
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={onCancel}>
                        ✕ Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
