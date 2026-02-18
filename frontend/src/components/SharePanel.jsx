import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SharePanel({ shareUrl, password, onNewRecording }) {
    const [copied, setCopied] = useState(false)
    const [passwordCopied, setPasswordCopied] = useState(false)
    const inputRef = useRef(null)

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }).catch(() => {
            inputRef.current?.select()
            document.execCommand('copy')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    const copyPassword = () => {
        navigator.clipboard.writeText(password).then(() => {
            setPasswordCopied(true)
            setTimeout(() => setPasswordCopied(false), 2000)
        })
    }

    return (
        <div className="card animate-in">
            <div className="text-center">
                <div style={{
                    width: 64, height: 64, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, margin: '0 auto 20px', animation: 'fadeInScale 0.4s cubic-bezier(0.4,0,0.2,1)'
                }}>✅</div>

                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your recording is ready!</h3>
                <p className="text-secondary mb-24" style={{ fontSize: 14 }}>Share this link with anyone</p>

                {password && (
                    <div className="mb-24" style={{
                        background: 'rgba(234, 179, 8, 0.1)',
                        border: '1px solid rgba(234, 179, 8, 0.2)',
                        padding: 16, borderRadius: 12, textAlign: 'left'
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#ca8a04', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            🔒 Password Required
                        </div>
                        <div className="flex items-center justify-between gap-12" style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: 8 }}>
                            <code style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', color: '#fef08a' }}>
                                {password}
                            </code>
                            <button
                                className={`btn btn-sm ${passwordCopied ? 'btn-success' : 'btn-secondary'}`}
                                onClick={copyPassword}
                                style={{ fontSize: 12, padding: '4px 10px', height: 32 }}
                            >
                                {passwordCopied ? '✅' : 'Copy'}
                            </button>
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
                            Video auto-deletes in 15 minutes.
                        </div>
                    </div>
                )}

                <div className="share-link-box mb-16">
                    <input ref={inputRef} type="text" className="share-link-input" value={shareUrl} readOnly />
                    <button
                        className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`}
                        onClick={copyLink}
                    >
                        {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                </div>

                <div className="flex gap-12 justify-center flex-wrap">
                    <a href={shareUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                        ▶ Open Viewer
                    </a>
                    <button className="btn btn-secondary btn-sm" onClick={onNewRecording}>
                        🔴 New Recording
                    </button>
                </div>
            </div>
        </div>
    )
}
