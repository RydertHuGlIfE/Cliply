import { useState } from 'react'

export default function SetupPanel({ onStart }) {
    const [useMic, setUseMic] = useState(true)
    const [useSystemAudio, setUseSystemAudio] = useState(false)

    return (
        <div className="card animate-in">
            <div className="flex justify-between items-center mb-24">
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recording Options</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <label className="toggle-group" onClick={() => setUseMic(v => !v)}>
                    <div className={`toggle-switch ${useMic ? 'on' : ''}`} />
                    <div>
                        <div className="toggle-label-title">🎙️ Microphone</div>
                        <div className="toggle-label-desc">Include your voice</div>
                    </div>
                </label>

                <label className="toggle-group" onClick={() => setUseSystemAudio(v => !v)}>
                    <div className={`toggle-switch ${useSystemAudio ? 'on' : ''}`} />
                    <div>
                        <div className="toggle-label-title">🔊 System Audio</div>
                        <div className="toggle-label-desc">Capture tab/app audio</div>
                    </div>
                </label>
            </div>

            <div className="text-center">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => onStart({ useMic, useSystemAudio })}
                >
                    <span>🔴</span> Start Recording
                </button>
                <p className="text-secondary mt-12" style={{ fontSize: 13 }}>
                    You'll be prompted to choose a screen, window, or tab
                </p>
            </div>
        </div>
    )
}
