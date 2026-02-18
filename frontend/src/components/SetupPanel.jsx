import { useState } from 'react'

export default function SetupPanel({ onStart }) {
    const [useMic, setUseMic] = useState(true)
    const [useSystemAudio, setUseSystemAudio] = useState(false)
    const [useWebcam, setUseWebcam] = useState(false)

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

                <label className="toggle-group" onClick={() => setUseWebcam(v => !v)}>
                    <div className={`toggle-switch ${useWebcam ? 'on' : ''}`} />
                    <div>
                        <div className="toggle-label-title">📷 Webcam</div>
                        <div className="toggle-label-desc">Show face cam overlay</div>
                    </div>
                </label>
            </div>

            {useSystemAudio && navigator.userAgent.includes('Linux') && (
                <div className="hint-box mb-24" style={{
                    background: 'rgba(234, 179, 8, 0.1)',
                    border: '1px solid rgba(234, 179, 8, 0.2)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 13,
                    color: '#eab308'
                }}>
                    ℹ️ <b>Linux Tip:</b> "Entire Screen" sharing often forces silence. Share a <b>Browser Tab</b> for reliable audio.
                </div>
            )}

            <div className="text-center">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => onStart({ useMic, useSystemAudio, useWebcam })}
                >
                    🔴 Start Recording
                </button>
                <p className="text-secondary mt-12" style={{ fontSize: 13 }}>
                    You'll be prompted to choose a screen, window, or tab
                </p>
            </div>
        </div>
    )
}
